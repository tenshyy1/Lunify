package models

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

const connStr = "postgres://postgres:12345@localhost:5432/mydb?sslmode=disable"

func InitDB() *sql.DB {
	db, err := sql.Open("postgres", connStr)
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
            password TEXT NOT NULL,
            email VARCHAR(100)
        );
    `)
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec(`
        CREATE TABLE IF NOT EXISTS user_details (
            user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
            first_name VARCHAR(50),
            last_name VARCHAR(50)
        );
    `)
	if err != nil {
		log.Fatal(err)
	}

	return db
}
