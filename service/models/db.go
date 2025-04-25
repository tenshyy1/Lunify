package models

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

const (
	systemConnStr = "postgres://postgres:12345@localhost:5432/postgres?sslmode=disable"
	appConnStr    = "postgres://postgres:12345@localhost:5432/mydb?sslmode=disable"
)

// InitDB initializes the database and ensures mydb exists
func InitDB() (*gorm.DB, error) {
	// Connect to system database
	systemDB, err := gorm.Open(postgres.Open(systemConnStr), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	// Check if mydb exists
	var dbExists bool
	if err := systemDB.Raw("SELECT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'mydb')").Scan(&dbExists).Error; err != nil {
		return nil, err
	}
	if !dbExists {
		log.Println("Creating database mydb...")
		if err := systemDB.Exec("CREATE DATABASE mydb").Error; err != nil {
			return nil, err
		}
		log.Println("Database mydb created successfully.")
	}

	// Connect to app database
	db, err := gorm.Open(postgres.Open(appConnStr), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	// Verify connection
	sqlDB, err := db.DB()
	if err != nil {
		return nil, err
	}
	if err := sqlDB.Ping(); err != nil {
		return nil, err
	}

	return db, nil
}
