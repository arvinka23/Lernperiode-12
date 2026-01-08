package controllers

import (
	"context"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"stream4you/backend/database"
	"stream4you/backend/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var movieCollection = database.DB.Collection("movies")

func StreamVideo(c *gin.Context) {
	movieID := c.Param("id")
	objectID, err := primitive.ObjectIDFromHex(movieID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid movie ID"})
		return
	}

	// Fetch movie from database
	var movie models.Movie
	err = movieCollection.FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&movie)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Movie not found"})
		return
	}

	// Use videoUrl from database or fallback to default path
	var videoPath string
	if movie.VideoURL != "" {
		videoPath = movie.VideoURL
	} else {
		videoPath = filepath.Join("uploads", "videos", movieID+".mp4")
	}
	
	// Check if file exists
	if _, err := os.Stat(videoPath); os.IsNotExist(err) {
		c.JSON(http.StatusNotFound, gin.H{"error": "Video file not found"})
		return
	}

	// Get file info
	file, err := os.Open(videoPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open video file"})
		return
	}
	defer file.Close()

	fileInfo, err := file.Stat()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get file info"})
		return
	}

	// Set headers for video streaming
	c.Header("Content-Type", "video/mp4")
	c.Header("Accept-Ranges", "bytes")
	c.Header("Content-Length", strconv.FormatInt(fileInfo.Size(), 10))

	// Handle range requests for video seeking
	rangeHeader := c.GetHeader("Range")
	if rangeHeader != "" {
		http.ServeContent(c.Writer, c.Request, filepath.Base(videoPath), fileInfo.ModTime(), file)
	} else {
		http.ServeFile(c.Writer, c.Request, videoPath)
	}
}

func GetVideoURL(c *gin.Context) {
	movieID := c.Param("id")
	videoURL := "/api/stream/" + movieID
	c.JSON(http.StatusOK, gin.H{"videoUrl": videoURL})
}

