package main

import (
	"log"

	"service/handlers/login"
	"service/handlers/profile"
	"service/models"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"

	"service/common"
)

func main() {
	// Инициализация БД
	dbInstance := models.InitDB()
	defer dbInstance.Close()

	// Установка подключения в common
	common.DB = dbInstance

	// Создание приложения Fiber
	app := fiber.New()

	// Настройка CORS
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3001",
		AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders: "Content-Type, Authorization",
	}))

	app.Static("/uploads", "./uploads")

	// Маршруты
	app.Post("/register", login.RegisterHandler)
	app.Post("/login", login.LoginHandler)
	app.Post("/logout", login.LogoutHandler)
	app.Get("/profile", profile.GetProfileHandler)
	app.Put("/profile", profile.UpdateProfileHandler)
	app.Post("/profile/avatar", profile.UpdateAvatarHandler)

	// Запуск сервера
	log.Fatal(app.Listen(":8099"))
}
