package profile

import (
	"log"
	"service/common"

	"github.com/gofiber/fiber/v2"
)

func GetProfileHandler(c *fiber.Ctx) error {
	tokenString := c.Get("Authorization")
	if tokenString == "" {
		return common.SendError(c, "Token required", fiber.StatusUnauthorized)
	}

	claims, err := common.ParseJWT(tokenString)
	if err != nil {
		log.Printf("ParseJWT error: %v", err)
		return common.SendError(c, "Invalid token", fiber.StatusUnauthorized)
	}

	var user common.User
	err = common.DB.QueryRow(
		"SELECT u.id, u.login, ud.email, ud.first_name, ud.last_name "+
			"FROM users u LEFT JOIN user_details ud ON u.id = ud.user_id "+
			"WHERE u.id = $1",
		claims.UserID,
	).Scan(&user.ID, &user.Login, &user.Email, &user.FirstName, &user.LastName)
	if err != nil {
		log.Printf("Database error for user_id %d: %v", claims.UserID, err)
		return common.SendError(c, "User not found", fiber.StatusNotFound)
	}

	return c.JSON(user)
}

func UpdateProfileHandler(c *fiber.Ctx) error {
	tokenString := c.Get("Authorization")
	if tokenString == "" {
		return common.SendError(c, "Token required", fiber.StatusUnauthorized)
	}

	claims, err := common.ParseJWT(tokenString)
	if err != nil {
		log.Printf("ParseJWT error: %v", err)
		return common.SendError(c, "Invalid token", fiber.StatusUnauthorized)
	}

	var user common.User
	if err := c.BodyParser(&user); err != nil {
		return common.SendError(c, "Invalid request body", fiber.StatusBadRequest)
	}

	_, err = common.DB.Exec(
		"INSERT INTO user_details (user_id, first_name, last_name, email) VALUES ($1, $2, $3, $4) "+
			"ON CONFLICT (user_id) DO UPDATE SET first_name = $2, last_name = $3, email = $4",
		claims.UserID, user.FirstName, user.LastName, user.Email,
	)
	if err != nil {
		log.Printf("Failed to update user_details for user_id %d: %v", claims.UserID, err)
		return common.SendError(c, "Failed to update user details", fiber.StatusInternalServerError)
	}

	return c.JSON(common.Response{
		Message: "Profile updated successfully",
	})
}
