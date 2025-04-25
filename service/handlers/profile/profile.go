package profile

import (
	"fmt"
	"log"
	"os"
	"path/filepath"

	"service/common"
	"service/models"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func GetProfileHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		tokenString := c.Get("Authorization")
		if tokenString == "" {
			return common.SendError(c, "Token required", fiber.StatusUnauthorized)
		}

		claims, err := common.ParseJWT(tokenString)
		if err != nil {
			log.Printf("ParseJWT error: %v", err)
			return common.SendError(c, "Invalid token", fiber.StatusUnauthorized)
		}

		// Find user with details
		var user models.User
		if err := db.Preload("UserDetails").First(&user, "id = ?", claims.UserID).Error; err != nil {
			log.Printf("Database error for user_id %d: %v", claims.UserID, err)
			return common.SendError(c, "User not found", fiber.StatusNotFound)
		}

		// Map to response
		deletedAt := ""
		if user.DeletedAt.Valid {
			deletedAt = user.DeletedAt.Time.Format("2006.01.02 15:04")
		}
		response := map[string]interface{}{
			"id":         user.ID,
			"login":      user.Login,
			"email":      stringOrEmpty(user.UserDetails.Email),
			"first_name": stringOrEmpty(user.UserDetails.FirstName),
			"last_name":  stringOrEmpty(user.UserDetails.LastName),
			"avatar_url": stringOrEmpty(user.UserDetails.AvatarURL),
			"created_at": user.CreatedAt.Format("2006.01.02 15:04"),
			"deleted_at": deletedAt,
		}

		return c.JSON(response)
	}
}

// Helper to handle nullable strings
func stringOrEmpty(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}

func UpdateProfileHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		tokenString := c.Get("Authorization")
		if tokenString == "" {
			return common.SendError(c, "Token required", fiber.StatusUnauthorized)
		}

		claims, err := common.ParseJWT(tokenString)
		if err != nil {
			log.Printf("ParseJWT error: %v", err)
			return common.SendError(c, "Invalid token", fiber.StatusUnauthorized)
		}

		var input struct {
			Email     *string `json:"email"`
			FirstName *string `json:"first_name"`
			LastName  *string `json:"last_name"`
		}
		if err := c.BodyParser(&input); err != nil {
			return common.SendError(c, "Invalid request body", fiber.StatusBadRequest)
		}

		// Update or create user details
		userDetails := models.UserDetails{
			UserID:    uint(claims.UserID),
			Email:     input.Email,
			FirstName: input.FirstName,
			LastName:  input.LastName,
		}
		if err := db.Where("user_id = ?", claims.UserID).Assign(userDetails).FirstOrCreate(&userDetails).Error; err != nil {
			log.Printf("Failed to update user_details for user_id %d: %v", claims.UserID, err)
			return common.SendError(c, "Failed to update user details", fiber.StatusInternalServerError)
		}

		return c.JSON(common.Response{
			Message: "Profile updated successfully",
		})
	}
}

func UpdateAvatarHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
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

		// Find current avatar
		var userDetails models.UserDetails
		if err := db.Where("user_id = ?", claims.UserID).First(&userDetails).Error; err != nil && err != gorm.ErrRecordNotFound {
			log.Printf("Failed to fetch current avatar URL for user_id %d: %v", claims.UserID, err)
			return common.SendError(c, "Failed to fetch current avatar", fiber.StatusInternalServerError)
		}

		// Delete old avatar file if exists
		if userDetails.AvatarURL != nil && *userDetails.AvatarURL != "" {
			oldFilePath := filepath.Join("./uploads/avatars", filepath.Base(*userDetails.AvatarURL))
			if err := os.Remove(oldFilePath); err != nil && !os.IsNotExist(err) {
				log.Printf("Failed to delete old avatar file %s: %v", oldFilePath, err)
			}
		}

		// Save file
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

		// Create URL
		avatarURL := fmt.Sprintf("/uploads/avatars/%s", fileName)
		userDetails = models.UserDetails{
			UserID:    uint(claims.UserID),
			AvatarURL: &avatarURL,
		}
		if err := db.Where("user_id = ?", claims.UserID).Assign(userDetails).FirstOrCreate(&userDetails).Error; err != nil {
			log.Printf("Failed to update avatar URL for user_id %d: %v", claims.UserID, err)
			return common.SendError(c, "Failed to update avatar", fiber.StatusInternalServerError)
		}

		return c.JSON(fiber.Map{
			"message":    "Avatar updated successfully",
			"avatar_url": avatarURL,
		})
	}
}

// ChangePasswordHandler handles password change requests
func ChangePasswordHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		tokenString := c.Get("Authorization")
		if tokenString == "" {
			return common.SendError(c, "Token required", fiber.StatusUnauthorized)
		}

		claims, err := common.ParseJWT(tokenString)
		if err != nil {
			log.Printf("ParseJWT error: %v", err)
			return common.SendError(c, "Invalid token", fiber.StatusUnauthorized)
		}

		var input struct {
			NewPassword string `json:"new_password"`
		}
		if err := c.BodyParser(&input); err != nil {
			return common.SendError(c, "Invalid request body", fiber.StatusBadRequest)
		}

		// Validate input
		if input.NewPassword == "" {
			return common.SendError(c, "New password is required", fiber.StatusBadRequest)
		}

		// Password strength validation
		if len(input.NewPassword) < 3 {
			return common.SendError(c, "New password must be at least 3 characters long", fiber.StatusBadRequest)
		}

		// Find user
		var user models.User
		if err := db.First(&user, "id = ?", claims.UserID).Error; err != nil {
			log.Printf("Database error for user_id %d: %v", claims.UserID, err)
			return common.SendError(c, "User not found", fiber.StatusNotFound)
		}

		// Hash new password
		hashedPassword, err := common.HashPassword(input.NewPassword)
		if err != nil {
			log.Printf("Failed to hash password for user_id %d: %v", claims.UserID, err)
			return common.SendError(c, "Failed to process password", fiber.StatusInternalServerError)
		}

		// Update password
		user.Password = hashedPassword
		if err := db.Save(&user).Error; err != nil {
			log.Printf("Failed to update password for user_id %d: %v", claims.UserID, err)
			return common.SendError(c, "Failed to update password", fiber.StatusInternalServerError)
		}

		return c.JSON(common.Response{
			Message: "Password updated successfully",
		})
	}
}
