package models

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

const systemConnStr = "postgres://postgres:12345@localhost:5432/postgres?sslmode=disable"
const appConnStr = "postgres://postgres:12345@localhost:5432/mydb?sslmode=disable"

func InitDB() *sql.DB {
	systemDB, err := sql.Open("postgres", systemConnStr)
	if err != nil {
		log.Fatal(err)
	}
	defer systemDB.Close()

	var dbExists bool
	err = systemDB.QueryRow("SELECT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'mydb')").Scan(&dbExists)
	if err != nil {
		log.Fatal(err)
	}
	if !dbExists {
		log.Println("Creating database mydb...")
		_, err = systemDB.Exec("CREATE DATABASE mydb")
		if err != nil {
			log.Printf("Failed to create database mydb: %v", err)
			log.Fatal(err)
		}
		log.Println("Database mydb created successfully.")
	}
	db, err := sql.Open("postgres", appConnStr)
	if err != nil {
		log.Fatal(err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            login VARCHAR(50) UNIQUE NOT NULL,
            password TEXT NOT NULL
        );
    `)
	if err != nil {
		log.Fatal(err)
	}
	_, err = db.Exec(`
        CREATE TABLE IF NOT EXISTS user_details (
            user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
            first_name VARCHAR(50),
            last_name VARCHAR(50),
            email VARCHAR(100),
            avatar_url TEXT -- Добавлено поле для URL аватарки
        );
    `)
	if err != nil {
		log.Fatal(err)
	}

	var emailColumnExistsInUserDetails bool
	err = db.QueryRow(`
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'user_details' AND column_name = 'email'
        );
    `).Scan(&emailColumnExistsInUserDetails)
	if err != nil {
		log.Fatal(err)
	}

	if !emailColumnExistsInUserDetails {
		log.Println("Adding email column to user_details...")
		_, err = db.Exec(`ALTER TABLE user_details ADD COLUMN email VARCHAR(100);`)
		if err != nil {
			log.Printf("Failed to add email column to user_details: %v", err)
			log.Fatal(err)
		}
		log.Println("Email column added to user_details.")
	}

	var avatarColumnExistsInUserDetails bool
	err = db.QueryRow(`
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'user_details' AND column_name = 'avatar_url'
        );
    `).Scan(&avatarColumnExistsInUserDetails)
	if err != nil {
		log.Fatal(err)
	}

	if !avatarColumnExistsInUserDetails {
		log.Println("Adding avatar_url column to user_details...")
		_, err = db.Exec(`ALTER TABLE user_details ADD COLUMN avatar_url TEXT;`)
		if err != nil {
			log.Printf("Failed to add avatar_url column to user_details: %v", err)
			log.Fatal(err)
		}
		log.Println("Avatar_url column added to user_details.")
	}

	var emailColumnExistsInUsers bool
	err = db.QueryRow(`
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'users' AND column_name = 'email'
        );
    `).Scan(&emailColumnExistsInUsers)
	if err != nil {
		log.Fatal(err)
	}

	if emailColumnExistsInUsers {
		log.Println("Migrating email from users to user_details...")
		_, err = db.Exec(`
            INSERT INTO user_details (user_id, email)
            SELECT id, email FROM users
            WHERE email IS NOT NULL
            ON CONFLICT (user_id) DO UPDATE SET email = EXCLUDED.email;
        `)
		if err != nil {
			log.Printf("Failed to migrate email data: %v", err)
			log.Fatal(err)
		}
		_, err = db.Exec(`ALTER TABLE users DROP COLUMN IF EXISTS email;`)
		if err != nil {
			log.Printf("Failed to drop email column from users: %v", err)
			log.Fatal(err)
		}
		log.Println("Email migration completed successfully.")
	} else {
		log.Println("Email column in users does not exist, no migration needed.")
	}

	return db
}
