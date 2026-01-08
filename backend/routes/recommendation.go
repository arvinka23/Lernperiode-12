package routes

import (
	"stream4you/backend/controllers"
	"stream4you/backend/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRecommendationRoutes(router *gin.RouterGroup) {
	recommendations := router.Group("/recommendations", middleware.AuthMiddleware())
	{
		recommendations.GET("", controllers.GetRecommendations)
	}

	ai := router.Group("/ai", middleware.AuthMiddleware(), middleware.AdminMiddleware())
	{
		ai.POST("/movies/:id/description", controllers.GenerateMovieDescription)
	}
}



