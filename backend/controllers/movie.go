package controllers

import (
	"context"
	"net/http"
	"strconv"
	"strings"
	"time"

	"stream4you/backend/database"
	"stream4you/backend/models"
	"stream4you/backend/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var movieCollection = database.DB.Collection("movies")
var reviewCollection = database.DB.Collection("reviews")

func GetMovies(c *gin.Context) {
	// Pagination
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "12"))
	skip := (page - 1) * limit

	// Search
	search := c.Query("search")
	genre := c.Query("genre")
	year := c.Query("year")

	// Build filter
	filter := bson.M{}
	if search != "" {
		filter["$or"] = []bson.M{
			{"title": bson.M{"$regex": search, "$options": "i"}},
			{"description": bson.M{"$regex": search, "$options": "i"}},
		}
	}
	if genre != "" {
		filter["genre"] = bson.M{"$in": []string{genre}}
	}
	if year != "" {
		yearInt, _ := strconv.Atoi(year)
		filter["year"] = yearInt
	}

	// Options
	opts := options.Find().SetSkip(int64(skip)).SetLimit(int64(limit)).SetSort(bson.M{"createdAt": -1})

	cursor, err := movieCollection.Find(context.Background(), filter, opts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch movies"})
		return
	}
	defer cursor.Close(context.Background())

	var movies []models.Movie
	if err := cursor.All(context.Background(), &movies); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode movies"})
		return
	}

	// Get total count
	total, _ := movieCollection.CountDocuments(context.Background(), filter)

	c.JSON(http.StatusOK, gin.H{
		"movies": movies,
		"pagination": gin.H{
			"page":  page,
			"limit": limit,
			"total": total,
		},
	})
}

func GetMovie(c *gin.Context) {
	id := c.Param("id")
	objectID, err := primitive.ObjectIDFromHex(id)
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

	// Get reviews
	cursor, err := reviewCollection.Find(context.Background(), bson.M{"movieId": objectID})
	if err == nil {
		defer cursor.Close(context.Background())
		var reviews []models.Review
		cursor.All(context.Background(), &reviews)
		c.JSON(http.StatusOK, gin.H{
			"movie":  movie,
			"reviews": reviews,
		})
	} else {
		c.JSON(http.StatusOK, gin.H{
			"movie":  movie,
			"reviews": []models.Review{},
		})
	}
}

func CreateMovie(c *gin.Context) {
	var req models.CreateMovieRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _ := c.Get("userId")
	objectID, err := primitive.ObjectIDFromHex(userID.(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	movie := models.Movie{
		ID:          primitive.NewObjectID(),
		Title:       req.Title,
		Description: req.Description,
		Genre:       req.Genre,
		Year:        req.Year,
		Duration:    req.Duration,
		PosterURL:   req.PosterURL,
		VideoURL:    req.VideoURL,
		Director:    req.Director,
		Cast:        req.Cast,
		Rating:      0,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
		CreatedBy:   objectID,
	}

	_, err = movieCollection.InsertOne(context.Background(), movie)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create movie"})
		return
	}

	c.JSON(http.StatusCreated, movie)
}

func UpdateMovie(c *gin.Context) {
	id := c.Param("id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid movie ID"})
		return
	}

	var req models.UpdateMovieRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	update := bson.M{
		"updatedAt": time.Now(),
	}
	if req.Title != "" {
		update["title"] = req.Title
	}
	if req.Description != "" {
		update["description"] = req.Description
	}
	if req.Genre != nil {
		update["genre"] = req.Genre
	}
	if req.Year != 0 {
		update["year"] = req.Year
	}
	if req.Duration != 0 {
		update["duration"] = req.Duration
	}
	if req.PosterURL != "" {
		update["posterUrl"] = req.PosterURL
	}
	if req.VideoURL != "" {
		update["videoUrl"] = req.VideoURL
	}
	if req.Director != "" {
		update["director"] = req.Director
	}
	if req.Cast != nil {
		update["cast"] = req.Cast
	}

	result := movieCollection.FindOneAndUpdate(
		context.Background(),
		bson.M{"_id": objectID},
		bson.M{"$set": update},
		options.FindOneAndUpdate().SetReturnDocument(options.After),
	)

	if result.Err() != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Movie not found"})
		return
	}

	var movie models.Movie
	result.Decode(&movie)
	c.JSON(http.StatusOK, movie)
}

func DeleteMovie(c *gin.Context) {
	id := c.Param("id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid movie ID"})
		return
	}

	result, err := movieCollection.DeleteOne(context.Background(), bson.M{"_id": objectID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete movie"})
		return
	}

	if result.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Movie not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Movie deleted successfully"})
}

func AddReview(c *gin.Context) {
	var req struct {
		MovieID string `json:"movieId" binding:"required"`
		Rating  int    `json:"rating" binding:"required,min=1,max=5"`
		Comment string `json:"comment"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	movieID, err := primitive.ObjectIDFromHex(req.MovieID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid movie ID"})
		return
	}

	userID, _ := c.Get("userId")
	userObjectID, err := primitive.ObjectIDFromHex(userID.(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	review := models.Review{
		ID:        primitive.NewObjectID(),
		MovieID:   movieID,
		UserID:    userObjectID,
		Rating:    req.Rating,
		Comment:   req.Comment,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	_, err = reviewCollection.InsertOne(context.Background(), review)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create review"})
		return
	}

	// Update movie rating
	updateMovieRating(movieID)

	c.JSON(http.StatusCreated, review)
}

func updateMovieRating(movieID primitive.ObjectID) {
	cursor, err := reviewCollection.Find(context.Background(), bson.M{"movieId": movieID})
	if err != nil {
		return
	}
	defer cursor.Close(context.Background())

	var reviews []models.Review
	cursor.All(context.Background(), &reviews)

	if len(reviews) == 0 {
		return
	}

	sum := 0
	for _, review := range reviews {
		sum += review.Rating
	}

	avgRating := float64(sum) / float64(len(reviews))
	movieCollection.UpdateOne(
		context.Background(),
		bson.M{"_id": movieID},
		bson.M{"$set": bson.M{"rating": avgRating}},
	)
}

func GetGenres(c *gin.Context) {
	cursor, err := movieCollection.Find(context.Background(), bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch genres"})
		return
	}
	defer cursor.Close(context.Background())

	var movies []models.Movie
	cursor.All(context.Background(), &movies)

	genreMap := make(map[string]bool)
	for _, movie := range movies {
		for _, genre := range movie.Genre {
			genreMap[genre] = true
		}
	}

	genres := []string{}
	for genre := range genreMap {
		genres = append(genres, genre)
	}

	c.JSON(http.StatusOK, gin.H{"genres": genres})
}



