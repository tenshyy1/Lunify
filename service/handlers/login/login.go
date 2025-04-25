package login

import (
	"service/common"
	"service/models"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func RegisterHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		if c.Method() != fiber.MethodPost {
			return common.SendError(c, "Method not allowed", fiber.StatusMethodNotAllowed)
		}

		var user models.User
		if err := c.BodyParser(&user); err != nil {
			return common.SendError(c, "Invalid request body", fiber.StatusBadRequest)
		}

		hashedPassword, err := common.HashPassword(user.Password)
		if err != nil {
			return common.SendError(c, "Internal server error", fiber.StatusInternalServerError)
		}

		// Create user
		user.Password = hashedPassword
		if err := db.Create(&user).Error; err != nil {
			return common.SendError(c, "Login already exists", fiber.StatusConflict)
		}

		token, err := common.GenerateToken(int(user.ID))
		if err != nil {
			return common.SendError(c, "Failed to generate token", fiber.StatusInternalServerError)
		}

		return c.JSON(common.Response{
			Message: "User registered successfully",
			Token:   token,
		})
	}
}

func LoginHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		if c.Method() != fiber.MethodPost {
			return common.SendError(c, "Method not allowed", fiber.StatusMethodNotAllowed)
		}

		var input struct {
			Login    string `json:"login"`
			Password string `json:"password"`
		}
		if err := c.BodyParser(&input); err != nil {
			return common.SendError(c, "Invalid request body", fiber.StatusBadRequest)
		}

		// Find user
		var user models.User
		if err := db.Where("login = ?", input.Login).First(&user).Error; err != nil {
			return common.SendError(c, "Invalid login", fiber.StatusUnauthorized)
		}

		if err := common.ComparePassword(user.Password, input.Password); err != nil {
			return common.SendError(c, "Invalid password", fiber.StatusUnauthorized)
		}

		token, err := common.GenerateToken(int(user.ID))
		if err != nil {
			return common.SendError(c, "Failed to generate token", fiber.StatusInternalServerError)
		}

		return c.JSON(common.Response{
			Message: "Login successful",
			Token:   token,
		})
	}
}

// logout
func LogoutHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		if c.Method() != fiber.MethodPost {
			return common.SendError(c, "Method not allowed", fiber.StatusMethodNotAllowed)
		}

		return c.JSON(common.Response{
			Message: "Successfully logged out",
		})
	}
}
