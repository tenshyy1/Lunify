package login

import (
	"service/common"

	"github.com/gofiber/fiber/v2"
)

func RegisterHandler(c *fiber.Ctx) error {
	if c.Method() != fiber.MethodPost {
		return common.SendError(c, "Method not allowed", fiber.StatusMethodNotAllowed)
	}

	var user common.User
	if err := c.BodyParser(&user); err != nil {
		return common.SendError(c, "Invalid request body", fiber.StatusBadRequest)
	}

	hashedPassword, err := common.HashPassword(user.Password)
	if err != nil {
		return common.SendError(c, "Internal server error", fiber.StatusInternalServerError)
	}

	var id int
	err = common.DB.QueryRow(
		"INSERT INTO users (login, password) VALUES ($1, $2) RETURNING id",
		user.Login, hashedPassword,
	).Scan(&id)
	if err != nil {
		return common.SendError(c, "Login already exists", fiber.StatusConflict)
	}

	token, err := common.GenerateToken(id)
	if err != nil {
		return common.SendError(c, "Failed to generate token", fiber.StatusInternalServerError)
	}

	return c.JSON(common.Response{
		Message: "User registered successfully",
		Token:   token,
	})
}

func LoginHandler(c *fiber.Ctx) error {
	if c.Method() != fiber.MethodPost {
		return common.SendError(c, "Method not allowed", fiber.StatusMethodNotAllowed)
	}

	var user common.User
	if err := c.BodyParser(&user); err != nil {
		return common.SendError(c, "Invalid request body", fiber.StatusBadRequest)
	}

	var storedPassword string
	var id int
	err := common.DB.QueryRow(
		"SELECT id, password FROM users WHERE login = $1",
		user.Login,
	).Scan(&id, &storedPassword)
	if err != nil {
		return common.SendError(c, "Invalid credentials", fiber.StatusUnauthorized)
	}

	if err := common.ComparePassword(storedPassword, user.Password); err != nil {
		return common.SendError(c, "Invalid credentials", fiber.StatusUnauthorized)
	}

	token, err := common.GenerateToken(id)
	if err != nil {
		return common.SendError(c, "Failed to generate token", fiber.StatusInternalServerError)
	}

	return c.JSON(common.Response{
		Message: "Login successful",
		Token:   token,
	})
}

func LogoutHandler(c *fiber.Ctx) error {
	if c.Method() != fiber.MethodPost {
		return common.SendError(c, "Method not allowed", fiber.StatusMethodNotAllowed)
	}

	return c.JSON(common.Response{
		Message: "Successfully logged out",
	})
}
