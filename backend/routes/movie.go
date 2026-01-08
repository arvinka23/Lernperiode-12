package routes

import (
	"stream4you/backend/controllers"
	"stream4you/backend/middleware"

	"github.com/gin-gonic/gin"
)

func SetupMovieRoutes(router *gin.RouterGroup) {
	movies := router.Group("/movies")
	{
		// Public routes
		movies.GET("", controllers.GetMovies)
		movies.GET("/genres", controllers.GetGenres)
		movies.GET("/:id", controllers.GetMovie)

		// Protected routes
		movies.POST("/:id/reviews", middleware.AuthMiddleware(), controllers.AddReview)

		// Admin routes
		admin := movies.Group("", middleware.AuthMiddleware(), middleware.AdminMiddleware())
		{
			admin.POST("", controllers.CreateMovie)
			admin.PUT("/:id", controllers.UpdateMovie)
			admin.DELETE("/:id", controllers.DeleteMovie)
		}
	}
}



