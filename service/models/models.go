package models

import (
	"encoding/json"
	"log"
	"time"

	"gorm.io/gorm"
)

// User represents the users table
type User struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Login       string         `gorm:"type:varchar(50);unique;not null" json:"login"`
	Password    string         `gorm:"type:text;not null" json:"password"`
	CreatedAt   time.Time      `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	UserDetails UserDetails    `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
}

// Custom JSON marshalling
func (u User) MarshalJSON() ([]byte, error) {
	type Alias User
	var deletedAt string
	if u.DeletedAt.Valid {
		deletedAt = u.DeletedAt.Time.Format("2006.01.02 15:04")
	} else {
		deletedAt = ""
	}
	return json.Marshal(&struct {
		*Alias
		CreatedAt string `json:"created_at"`
		DeletedAt string `json:"deleted_at"`
	}{
		Alias:     (*Alias)(&u),
		CreatedAt: u.CreatedAt.Format("2006.01.02 15:04"),
		DeletedAt: deletedAt,
	})
}

func (User) TableName() string {
	return "users"
}

// UserDetails represents
type UserDetails struct {
	UserID    uint    `gorm:"primaryKey" json:"user_id"`
	FirstName *string `gorm:"type:varchar(50)" json:"first_name,omitempty"`
	LastName  *string `gorm:"type:varchar(50)" json:"last_name,omitempty"`
	Email     *string `gorm:"type:varchar(100)" json:"email,omitempty"`
	AvatarURL *string `gorm:"type:text" json:"avatar_url,omitempty"`
}

func (UserDetails) TableName() string {
	return "user_details"
}

// Portfolio represents
type Portfolio struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	UserID      uint      `gorm:"not null" json:"user_id"`
	Name        string    `gorm:"type:varchar(100);not null" json:"name"`
	Description *string   `gorm:"type:text" json:"description,omitempty"`
	CreatedAt   time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	TotalValue  *float64  `gorm:"type:decimal(18,2)" json:"total_value,omitempty"` // Новое поле
}

func (Portfolio) TableName() string {
	return "portfolios"
}

// PortfolioCoin
type PortfolioCoin struct {
	ID            uint     `gorm:"primaryKey" json:"id"`
	PortfolioID   uint     `gorm:"not null" json:"portfolio_id"`
	Currency      string   `gorm:"type:varchar(50);not null" json:"currency"`
	Ticker        string   `gorm:"type:varchar(10);not null" json:"ticker"`
	Amount        float64  `gorm:"type:decimal(18,8);not null" json:"amount"`
	ValueUSD      *float64 `gorm:"type:decimal(18,2)" json:"value_usd"`
	ChangePercent *float64 `gorm:"type:decimal(10,2)" json:"change_percent"`
	LogoURL       string   `gorm:"type:text" json:"logo_url,omitempty"`
}

func (PortfolioCoin) TableName() string {
	return "portfolio_coins"
}

// RunMigrations applies schema migrations
func RunMigrations(db *gorm.DB) error {
	// Create tables
	if err := db.AutoMigrate(&User{}, &UserDetails{}, &Portfolio{}, &PortfolioCoin{}); err != nil {
		return err
	}

	// Drop UpdatedAt if it exists
	if db.Migrator().HasColumn(&User{}, "UpdatedAt") {
		log.Println("Dropping UpdatedAt column from users...")
		if err := db.Migrator().DropColumn(&User{}, "UpdatedAt"); err != nil {
			return err
		}
		log.Println("UpdatedAt column dropped from users.")
	}

	// Add email column if missing
	if !db.Migrator().HasColumn(&UserDetails{}, "Email") {
		log.Println("Adding email column to user_details...")
		if err := db.Migrator().AddColumn(&UserDetails{}, "Email"); err != nil {
			return err
		}
		log.Println("Email column added to user_details.")
	}

	// Add avatar_url column if missing
	if !db.Migrator().HasColumn(&UserDetails{}, "AvatarURL") {
		log.Println("Adding avatar_url column to user_details...")
		if err := db.Migrator().AddColumn(&UserDetails{}, "AvatarURL"); err != nil {
			return err
		}
		log.Println("Avatar_url column added to user_details.")
	}
	if !db.Migrator().HasColumn(&Portfolio{}, "TotalValue") {
		log.Println("Adding total_value column to portfolios...")
		if err := db.Migrator().AddColumn(&Portfolio{}, "TotalValue"); err != nil {
			return err
		}
		log.Println("Total_value column added to portfolios.")
	}

	// Migrate email from users if exists
	if db.Migrator().HasColumn(&User{}, "email") {
		log.Println("Migrating email from users to user_details...")
		if err := db.Exec(`
			INSERT INTO user_details (user_id, email)
			SELECT id, email FROM users
			WHERE email IS NOT NULL
			ON CONFLICT (user_id) DO UPDATE SET email = EXCLUDED.email;
		`).Error; err != nil {
			return err
		}
		if err := db.Migrator().DropColumn(&User{}, "email"); err != nil {
			return err
		}
		log.Println("Email migration completed successfully.")
	} else {
		log.Println("Email column in users does not exist, no migration needed.")
	}

	return nil
}
