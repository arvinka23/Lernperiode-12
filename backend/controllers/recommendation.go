package controllers

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"

	"stream4you/backend/config"
	"stream4you/backend/database"
	"stream4you/backend/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var movieCollection = database.DB.Collection("movies")
var reviewCollection = database.DB.Collection("reviews")

type OpenAIRequest struct {
	Model    string    `json:"model"`
	Messages []Message `json:"messages"`
}

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type OpenAIResponse struct {
	Choices []Choice `json:"choices"`
}

type Choice struct {
	Message Message `json:"message"`
}

func GetRecommendations(c *gin.Context) {
	userID, _ := c.Get("userId")
	userObjectID, err := primitive.ObjectIDFromHex(userID.(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	// Get user's review history
	cursor, err := reviewCollection.Find(context.Background(), bson.M{"userId": userObjectID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user reviews"})
		return
	}
	defer cursor.Close(context.Background())

	var reviews []models.Review
	cursor.All(context.Background(), &reviews)

	// Get all movies
	movieCursor, err := movieCollection.Find(context.Background(), bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch movies"})
		return
	}
	defer movieCursor.Close(context.Background())

	var allMovies []models.Movie
	movieCursor.All(context.Background(), &allMovies)

	// Build user preferences from reviews
	userPreferences := buildUserPreferences(reviews, allMovies)

	// Call OpenAI API
	recommendations, err := getAIRecommendations(userPreferences, allMovies)
	if err != nil {
		// Fallback to simple recommendations if OpenAI fails
		recommendations = getSimpleRecommendations(reviews, allMovies)
	}

	c.JSON(http.StatusOK, gin.H{"recommendations": recommendations})
}

func buildUserPreferences(reviews []models.Review, movies []models.Movie) string {
	if len(reviews) == 0 {
		return "No viewing history available."
	}

	preferences := []string{}
	genreCount := make(map[string]int)
	avgRating := 0.0

	for _, review := range reviews {
		for _, movie := range movies {
			if movie.ID == review.MovieID {
				for _, genre := range movie.Genre {
					genreCount[genre] += review.Rating
				}
				avgRating += float64(review.Rating)
				preferences = append(preferences, fmt.Sprintf("- %s (rated %d/5)", movie.Title, review.Rating))
			}
		}
	}

	avgRating = avgRating / float64(len(reviews))

	// Find top genres
	topGenres := []string{}
	maxCount := 0
	for genre, count := range genreCount {
		if count > maxCount {
			maxCount = count
			topGenres = []string{genre}
		} else if count == maxCount {
			topGenres = append(topGenres, genre)
		}
	}

	result := fmt.Sprintf("User has watched and rated %d movies with an average rating of %.1f/5.\n", len(reviews), avgRating)
	result += fmt.Sprintf("Preferred genres: %s\n", strings.Join(topGenres, ", "))
	result += "Rated movies:\n" + strings.Join(preferences, "\n")

	return result
}

func getAIRecommendations(userPreferences string, movies []models.Movie) ([]models.Movie, error) {
	if config.AppConfig.OpenAIAPIKey == "" {
		return nil, fmt.Errorf("OpenAI API key not configured")
	}

	// Build movie list for context
	movieList := []string{}
	for _, movie := range movies {
		movieList = append(movieList, fmt.Sprintf("- %s (%s, %d)", movie.Title, strings.Join(movie.Genre, ", "), movie.Year))
	}

	prompt := fmt.Sprintf(`Based on the following user preferences, recommend 5 movies from the available catalog that the user would likely enjoy.

User Preferences:
%s

Available Movies:
%s

Please recommend exactly 5 movies by their exact titles. Return only the titles, one per line, without numbering or additional text.`, userPreferences, strings.Join(movieList, "\n"))

	requestBody := OpenAIRequest{
		Model: "gpt-3.5-turbo",
		Messages: []Message{
			{
				Role:    "user",
				Content: prompt,
			},
		},
	}

	jsonData, err := json.Marshal(requestBody)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("POST", "https://api.openai.com/v1/chat/completions", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+config.AppConfig.OpenAIAPIKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var openAIResp OpenAIResponse
	if err := json.Unmarshal(body, &openAIResp); err != nil {
		return nil, err
	}

	if len(openAIResp.Choices) == 0 {
		return nil, fmt.Errorf("no recommendations from OpenAI")
	}

	recommendedTitles := strings.Split(strings.TrimSpace(openAIResp.Choices[0].Message.Content), "\n")
	
	// Clean up titles (remove numbering, dashes, etc.)
	cleanedTitles := []string{}
	for _, title := range recommendedTitles {
		title = strings.TrimSpace(title)
		title = strings.TrimPrefix(title, "-")
		title = strings.TrimSpace(title)
		// Remove leading numbers
		for len(title) > 0 && title[0] >= '0' && title[0] <= '9' {
			title = strings.TrimSpace(title[1:])
			if len(title) > 0 && (title[0] == '.' || title[0] == ')') {
				title = strings.TrimSpace(title[1:])
			}
		}
		if title != "" {
			cleanedTitles = append(cleanedTitles, title)
		}
	}

	// Find movies by title
	recommendedMovies := []models.Movie{}
	for _, title := range cleanedTitles {
		for _, movie := range movies {
			if strings.EqualFold(movie.Title, title) {
				recommendedMovies = append(recommendedMovies, movie)
				break
			}
		}
	}

	return recommendedMovies, nil
}

func getSimpleRecommendations(reviews []models.Review, movies []models.Movie) []models.Movie {
	// Simple recommendation: movies with similar genres to highly rated movies
	genreScores := make(map[string]float64)
	
	for _, review := range reviews {
		if review.Rating >= 4 {
			for _, movie := range movies {
				if movie.ID == review.MovieID {
					for _, genre := range movie.Genre {
						genreScores[genre] += float64(review.Rating)
					}
				}
			}
		}
	}

	// Get top genres
	topGenres := []string{}
	maxScore := 0.0
	for genre, score := range genreScores {
		if score > maxScore {
			maxScore = score
			topGenres = []string{genre}
		} else if score == maxScore {
			topGenres = append(topGenres, genre)
		}
	}

	// Recommend movies with top genres that user hasn't reviewed
	reviewedMovieIDs := make(map[primitive.ObjectID]bool)
	for _, review := range reviews {
		reviewedMovieIDs[review.MovieID] = true
	}

	recommendations := []models.Movie{}
	for _, movie := range movies {
		if !reviewedMovieIDs[movie.ID] {
			for _, genre := range movie.Genre {
				for _, topGenre := range topGenres {
					if genre == topGenre {
						recommendations = append(recommendations, movie)
						goto nextMovie
					}
				}
			}
		}
	nextMovie:
	}

	// Limit to 5
	if len(recommendations) > 5 {
		recommendations = recommendations[:5]
	}

	return recommendations
}

func GenerateMovieDescription(c *gin.Context) {
	movieID := c.Param("id")
	objectID, err := primitive.ObjectIDFromHex(movieID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid movie ID"})
		return
	}

	var movie models.Movie
	err = movieCollection.FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&movie)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Movie not found"})
		return
	}

	if config.AppConfig.OpenAIAPIKey == "" {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "OpenAI API key not configured"})
		return
	}

	prompt := fmt.Sprintf(`Generate a compelling movie description for:
Title: %s
Year: %d
Genre: %s
Director: %s
Cast: %s

Write a 2-3 sentence description that would make someone want to watch this movie.`, 
		movie.Title, movie.Year, strings.Join(movie.Genre, ", "), movie.Director, strings.Join(movie.Cast, ", "))

	requestBody := OpenAIRequest{
		Model: "gpt-3.5-turbo",
		Messages: []Message{
			{
				Role:    "user",
				Content: prompt,
			},
		},
	}

	jsonData, err := json.Marshal(requestBody)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create request"})
		return
	}

	req, err := http.NewRequest("POST", "https://api.openai.com/v1/chat/completions", bytes.NewBuffer(jsonData))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create HTTP request"})
		return
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+config.AppConfig.OpenAIAPIKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to call OpenAI API"})
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read response"})
		return
	}

	var openAIResp OpenAIResponse
	if err := json.Unmarshal(body, &openAIResp); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse response"})
		return
	}

	if len(openAIResp.Choices) == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No response from OpenAI"})
		return
	}

	description := strings.TrimSpace(openAIResp.Choices[0].Message.Content)
	c.JSON(http.StatusOK, gin.H{"description": description})
}



