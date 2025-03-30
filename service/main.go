package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"service/login"

	_ "github.com/lib/pq"
)

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	connStr := "postgres://postgres:12345@localhost:5432/mydb?sslmode=disable"
	var err error
	login.DB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	defer login.DB.Close()

	err = login.DB.Ping()
	if err != nil {
		log.Fatal(err)
	}

	// Убрана таблица revoked_tokens
	_, err = login.DB.Exec(`
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

	http.HandleFunc("/register", login.RegisterHandler)
	http.HandleFunc("/login", login.LoginHandler)
	http.HandleFunc("/logout", login.LogoutHandler)
	http.HandleFunc("/profile", login.ProfileHandler)

	fmt.Println("Server starting on :8080...")
	log.Fatal(http.ListenAndServe(":8080", enableCORS(http.DefaultServeMux)))
}
