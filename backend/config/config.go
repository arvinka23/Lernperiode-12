package config

import (
	"os"
)

type Config struct {
	MongoURI      string
	JWTSecret     string
	OpenAIAPIKey  string
	DatabaseName  string
	Port          string
}

var AppConfig *Config

func LoadConfig() {
	AppConfig = &Config{
		MongoURI:     getEnv("MONGODB_URI", "mongodb://localhost:27017"),
		JWTSecret:    getEnv("JWT_SECRET", "your-secret-key-change-in-production"),
		OpenAIAPIKey: getEnv("OPENAI_API_KEY", ""),
		DatabaseName: getEnv("DATABASE_NAME", "stream4you"),
		Port:         getEnv("PORT", "8080"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func init() {
	LoadConfig()
}



