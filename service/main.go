package main

import (
	"log"

	"service/handlers/login"
	"service/handlers/market"
	"service/handlers/portfolio"
	"service/handlers/profile"
	"service/models"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	// Start db
	dbInstance, err := models.InitDB()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// Migrations
	if err := models.RunMigrations(dbInstance); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	// Fiber app
	app := fiber.New()

	// CORS settings
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3001",
		AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders: "Content-Type, Authorization",
	}))

	app.Static("/uploads", "./Uploads")

	// Routes
	app.Post("/register", login.RegisterHandler(dbInstance))
	app.Post("/login", login.LoginHandler(dbInstance))
	app.Post("/logout", login.LogoutHandler(dbInstance))
	app.Get("/profile", profile.GetProfileHandler(dbInstance))
	app.Put("/profile", profile.UpdateProfileHandler(dbInstance))
	app.Post("/profile/avatar", profile.UpdateAvatarHandler(dbInstance))
	app.Post("/profile/change-password", profile.ChangePasswordHandler(dbInstance))
	portfolio.SetupPortfolioRoutes(app, dbInstance)
	market.SetupMarketRoutes(app)

	// Start server
	log.Fatal(app.Listen(":8099"))
}
