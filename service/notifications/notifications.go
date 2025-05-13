package notifications

import (
	"service/common"
	"service/models"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// CreateNotification creates a new notification for a user
func CreateNotification(db *gorm.DB, userID uint, title, description, category string) error {
	notification := models.Notification{
		UserID:      userID,
		Title:       title,
		Description: description,
		Status:      "unread",
		Category:    category,
	}
	return db.Create(&notification).Error
}

// SetupNotificationRoutes sets up routes for notifications
func SetupNotificationRoutes(app *fiber.App, db *gorm.DB) {
	app.Get("/notifications", GetNotifications(db))
	app.Post("/notifications/:id/read", MarkNotificationRead(db))
	app.Post("/notifications/read-all", MarkAllNotificationsRead(db))
}

// GetNotifications returns a user's unread notifications
func GetNotifications(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims, err := common.ParseJWT(c.Get("Authorization"))
		if err != nil {
			return common.SendError(c, "Unauthorized", fiber.StatusUnauthorized)
		}

		var notifications []models.Notification
		// Запрашиваем только непрочитанные уведомления
		if err := db.Where("user_id = ? AND status = ?", claims.UserID, "unread").
			Order("created_at DESC").
			Find(&notifications).Error; err != nil {
			return common.SendError(c, "Failed to fetch notifications", fiber.StatusInternalServerError)
		}

		return c.JSON(notifications)
	}
}

// MarkNotificationRead deletes a single notification
func MarkNotificationRead(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims, err := common.ParseJWT(c.Get("Authorization"))
		if err != nil {
			return common.SendError(c, "Unauthorized", fiber.StatusUnauthorized)
		}

		id, err := c.ParamsInt("id")
		if err != nil {
			return common.SendError(c, "Invalid notification ID", fiber.StatusBadRequest)
		}

		var notification models.Notification
		if err := db.Where("id = ? AND user_id = ?", id, claims.UserID).First(&notification).Error; err != nil {
			return common.SendError(c, "Notification not found", fiber.StatusNotFound)
		}

		// Удаляем уведомление вместо изменения статуса
		if err := db.Delete(&notification).Error; err != nil {
			return common.SendError(c, "Failed to delete notification", fiber.StatusInternalServerError)
		}

		return c.JSON(common.Response{
			Message: "Notification deleted",
		})
	}
}

// MarkAllNotificationsRead deletes all notifications for a user
func MarkAllNotificationsRead(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims, err := common.ParseJWT(c.Get("Authorization"))
		if err != nil {
			return common.SendError(c, "Unauthorized", fiber.StatusUnauthorized)
		}

		// Удаляем все непрочитанные уведомления пользователя
		if err := db.Where("user_id = ? AND status = ?", claims.UserID, "unread").
			Delete(&models.Notification{}).Error; err != nil {
			return common.SendError(c, "Failed to delete all notifications", fiber.StatusInternalServerError)
		}

		return c.JSON(common.Response{
			Message: "All notifications deleted",
		})
	}
}
