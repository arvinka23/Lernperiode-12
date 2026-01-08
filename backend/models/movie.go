package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Movie struct {
	ID          primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Title       string             `json:"title" bson:"title" binding:"required"`
	Description string             `json:"description" bson:"description"`
	Genre       []string           `json:"genre" bson:"genre"`
	Year        int                `json:"year" bson:"year" binding:"required"`
	Duration    int                `json:"duration" bson:"duration"` // in minutes
	Rating      float64            `json:"rating" bson:"rating"`     // average rating
	PosterURL   string             `json:"posterUrl" bson:"posterUrl"`
	VideoURL    string             `json:"videoUrl" bson:"videoUrl"` // path to video file
	Director    string             `json:"director" bson:"director"`
	Cast        []string           `json:"cast" bson:"cast"`
	CreatedAt   time.Time          `json:"createdAt" bson:"createdAt"`
	UpdatedAt   time.Time          `json:"updatedAt" bson:"updatedAt"`
	CreatedBy   primitive.ObjectID `json:"createdBy" bson:"createdBy"`
}

type Review struct {
	ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	MovieID   primitive.ObjectID `json:"movieId" bson:"movieId" binding:"required"`
	UserID    primitive.ObjectID `json:"userId" bson:"userId" binding:"required"`
	Rating    int                `json:"rating" bson:"rating" binding:"required,min=1,max=5"`
	Comment   string             `json:"comment" bson:"comment"`
	CreatedAt time.Time          `json:"createdAt" bson:"createdAt"`
	UpdatedAt time.Time          `json:"updatedAt" bson:"updatedAt"`
}

type CreateMovieRequest struct {
	Title       string   `json:"title" binding:"required"`
	Description string   `json:"description"`
	Genre       []string `json:"genre"`
	Year        int      `json:"year" binding:"required"`
	Duration    int      `json:"duration"`
	PosterURL   string   `json:"posterUrl"`
	VideoURL    string   `json:"videoUrl"`
	Director    string   `json:"director"`
	Cast        []string `json:"cast"`
}

type UpdateMovieRequest struct {
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Genre       []string `json:"genre"`
	Year        int      `json:"year"`
	Duration    int      `json:"duration"`
	PosterURL   string   `json:"posterUrl"`
	VideoURL    string   `json:"videoUrl"`
	Director    string   `json:"director"`
	Cast        []string `json:"cast"`
}



