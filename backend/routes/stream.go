package routes

import (
	"stream4you/backend/controllers"
	"stream4you/backend/middleware"

	"github.com/gin-gonic/gin"
)

func SetupStreamRoutes(router *gin.RouterGroup) {
	stream := router.Group("/stream", middleware.AuthMiddleware())
	{
		stream.GET("/:id", controllers.StreamVideo)
		stream.GET("/:id/url", controllers.GetVideoURL)
	}
}



