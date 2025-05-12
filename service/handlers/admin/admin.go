package admin

import (
	"strconv"

	"service/common"
	"service/models"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// GetUsersHandler возвращает список всех пользователей
func GetUsersHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims, err := common.ParseJWT(c.Get("Authorization"))
		if err != nil {
			return common.SendError(c, "Unauthorized", fiber.StatusUnauthorized)
		}

		if claims.Role != "admin" {
			return common.SendError(c, "Admin access required", fiber.StatusForbidden)
		}

		var users []models.User
		if err := db.Preload("UserDetails").Find(&users).Error; err != nil {
			return common.SendError(c, "Failed to fetch users", fiber.StatusInternalServerError)
		}

		// Форматируем ответ
		response := make([]map[string]interface{}, len(users))
		for i, user := range users {
			var deletedAt string
			if user.DeletedAt.Valid {
				deletedAt = user.DeletedAt.Time.Format("2006-01-02 15:04:05")
			} else {
				deletedAt = ""
			}

			response[i] = map[string]interface{}{
				"id":         user.ID,
				"login":      user.Login,
				"role":       user.Role,
				"is_banned":  user.IsBanned,
				"email":      user.UserDetails.Email,
				"first_name": user.UserDetails.FirstName,
				"last_name":  user.UserDetails.LastName,
				"avatar_url": user.UserDetails.AvatarURL,
				"created_at": user.CreatedAt.Format("2006-01-02 15:04:05"),
				"deleted_at": deletedAt,
			}
		}

		return c.JSON(response)
	}
}

// BanUserHandler банит пользователя
func BanUserHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims, err := common.ParseJWT(c.Get("Authorization"))
		if err != nil {
			return common.SendError(c, "Unauthorized", fiber.StatusUnauthorized)
		}

		if claims.Role != "admin" {
			return common.SendError(c, "Admin access required", fiber.StatusForbidden)
		}

		userID, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return common.SendError(c, "Invalid user ID", fiber.StatusBadRequest)
		}

		var user models.User
		if err := db.First(&user, userID).Error; err != nil {
			return common.SendError(c, "User not found", fiber.StatusNotFound)
		}

		user.IsBanned = true
		if err := db.Save(&user).Error; err != nil {
			return common.SendError(c, "Failed to ban user", fiber.StatusInternalServerError)
		}

		return c.JSON(common.Response{
			Message: "User banned successfully",
		})
	}
}

// UnbanUserHandler разбанивает пользователя
func UnbanUserHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims, err := common.ParseJWT(c.Get("Authorization"))
		if err != nil {
			return common.SendError(c, "Unauthorized", fiber.StatusUnauthorized)
		}

		if claims.Role != "admin" {
			return common.SendError(c, "Admin access required", fiber.StatusForbidden)
		}

		userID, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return common.SendError(c, "Invalid user ID", fiber.StatusBadRequest)
		}

		var user models.User
		if err := db.First(&user, userID).Error; err != nil {
			return common.SendError(c, "User not found", fiber.StatusNotFound)
		}

		user.IsBanned = false
		if err := db.Save(&user).Error; err != nil {
			return common.SendError(c, "Failed to unban user", fiber.StatusInternalServerError)
		}

		return c.JSON(common.Response{
			Message: "User unbanned successfully",
		})
	}
}

// DeleteUserHandler удаляет пользователя из БД
func DeleteUserHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims, err := common.ParseJWT(c.Get("Authorization"))
		if err != nil {
			return common.SendError(c, "Unauthorized", fiber.StatusUnauthorized)
		}

		if claims.Role != "admin" {
			return common.SendError(c, "Admin access required", fiber.StatusForbidden)
		}

		userID, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return common.SendError(c, "Invalid user ID", fiber.StatusBadRequest)
		}

		// Приводим userID к uint для сравнения
		userIDUint := uint(userID)
		if claims.UserID == userIDUint {
			return common.SendError(c, "Cannot delete yourself", fiber.StatusForbidden)
		}

		var user models.User
		if err := db.First(&user, userID).Error; err != nil {
			return common.SendError(c, "User not found", fiber.StatusNotFound)
		}

		if err := db.Delete(&user).Error; err != nil {
			return common.SendError(c, "Failed to delete user", fiber.StatusInternalServerError)
		}

		return c.JSON(common.Response{
			Message: "User deleted successfully",
		})
	}
}
