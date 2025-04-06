package profile

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"
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
		"SELECT u.id, u.login, ud.email, ud.first_name, ud.last_name, ud.avatar_url "+
			"FROM users u LEFT JOIN user_details ud ON u.id = ud.user_id "+
			"WHERE u.id = $1",
		claims.UserID,
	).Scan(&user.ID, &user.Login, &user.Email, &user.FirstName, &user.LastName, &user.AvatarURL)
	if err != nil {
		log.Printf("Database error for user_id %d: %v", claims.UserID, err)
		return common.SendError(c, "User not found", fiber.StatusNotFound)
	}

	return c.JSON(user.ToJSONStruct())
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

func UpdateAvatarHandler(c *fiber.Ctx) error {
	tokenString := c.Get("Authorization")
	if tokenString == "" {
		return common.SendError(c, "Token required", fiber.StatusUnauthorized)
	}

	claims, err := common.ParseJWT(tokenString)
	if err != nil {
		log.Printf("ParseJWT error: %v", err)
		return common.SendError(c, "Invalid token", fiber.StatusUnauthorized)
	}

	file, err := c.FormFile("avatar")
	if err != nil {
		return common.SendError(c, "Avatar file required", fiber.StatusBadRequest)
	}

	mimeType := file.Header.Get("Content-Type")
	if mimeType != "image/jpeg" && mimeType != "image/png" {
		return common.SendError(c, "Only JPEG or PNG images are allowed", fiber.StatusBadRequest)
	}

	var currentAvatarURL string
	err = common.DB.QueryRow(
		"SELECT avatar_url FROM user_details WHERE user_id = $1",
		claims.UserID,
	).Scan(&currentAvatarURL)
	if err != nil && err != sql.ErrNoRows {
		log.Printf("Failed to fetch current avatar URL for user_id %d: %v", claims.UserID, err)
		return common.SendError(c, "Failed to fetch current avatar", fiber.StatusInternalServerError)
	}

	if currentAvatarURL != "" {
		oldFilePath := filepath.Join("./uploads/avatars", filepath.Base(currentAvatarURL))
		if err := os.Remove(oldFilePath); err != nil && !os.IsNotExist(err) {
			log.Printf("Failed to delete old avatar file %s: %v", oldFilePath, err)
		}
	}

	// save file
	uploadDir := "./uploads/avatars"
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		log.Printf("Failed to create upload directory: %v", err)
		return common.SendError(c, "Server error", fiber.StatusInternalServerError)
	}

	fileName := fmt.Sprintf("%d-%s", claims.UserID, file.Filename)
	filePath := filepath.Join(uploadDir, fileName)
	if err := c.SaveFile(file, filePath); err != nil {
		log.Printf("Failed to save file: %v", err)
		return common.SendError(c, "Failed to save avatar", fiber.StatusInternalServerError)
	}

	// create url
	avatarURL := fmt.Sprintf("/uploads/avatars/%s", fileName)
	_, err = common.DB.Exec(
		"INSERT INTO user_details (user_id, avatar_url) VALUES ($1, $2) "+
			"ON CONFLICT (user_id) DO UPDATE SET avatar_url = $2",
		claims.UserID, avatarURL,
	)
	if err != nil {
		log.Printf("Failed to update avatar URL for user_id %d: %v", claims.UserID, err)
		return common.SendError(c, "Failed to update avatar", fiber.StatusInternalServerError)
	}

	return c.JSON(fiber.Map{
		"message":    "Avatar updated successfully",
		"avatar_url": avatarURL,
	})
}
