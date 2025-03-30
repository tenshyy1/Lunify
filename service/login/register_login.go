package login

import (
	"database/sql"
	"encoding/json"
	"errors"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
)

var DB *sql.DB
var jwtKey = []byte("my_secret_key")

type User struct {
	ID        int    `json:"id"`
	Login     string `json:"login"`
	Password  string `json:"password"`
	Email     string `json:"email,omitempty"`
	FirstName string `json:"first_name,omitempty"`
	LastName  string `json:"last_name,omitempty"`
}

type Response struct {
	Message string `json:"message"`
	Token   string `json:"token,omitempty"`
}

type ErrorResponse struct {
	Message string `json:"message"`
}

type Claims struct {
	UserID int `json:"user_id"`
	jwt.StandardClaims
}

func generateToken(userID int) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		UserID: userID,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtKey)
}

func parseJWT(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return nil, errors.New("invalid token")
	}

	return claims, nil
}

func sendError(w http.ResponseWriter, message string, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(ErrorResponse{Message: message})
}

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		sendError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var user User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		sendError(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		sendError(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	var id int
	err = DB.QueryRow(
		"INSERT INTO users (login, password) VALUES ($1, $2) RETURNING id",
		user.Login, hashedPassword,
	).Scan(&id)
	if err != nil {
		sendError(w, "Login already exists", http.StatusConflict)
		return
	}

	if user.FirstName != "" || user.LastName != "" {
		_, err = DB.Exec(
			"INSERT INTO user_details (user_id, first_name, last_name) VALUES ($1, $2, $3)",
			id, user.FirstName, user.LastName,
		)
		if err != nil {
			sendError(w, "Failed to save user details", http.StatusInternalServerError)
			return
		}
	}

	token, err := generateToken(id)
	if err != nil {
		sendError(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	response := Response{
		Message: "User registered successfully",
		Token:   token,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		sendError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var user User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		sendError(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	var storedPassword string
	var id int
	err = DB.QueryRow(
		"SELECT id, password FROM users WHERE login = $1",
		user.Login,
	).Scan(&id, &storedPassword)
	if err != nil {
		sendError(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(storedPassword), []byte(user.Password))
	if err != nil {
		sendError(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	token, err := generateToken(id)
	if err != nil {
		sendError(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	response := Response{
		Message: "Login successful",
		Token:   token,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		sendError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	response := Response{
		Message: "Successfully logged out",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func ProfileHandler(w http.ResponseWriter, r *http.Request) {
	tokenString := r.Header.Get("Authorization")
	if tokenString == "" {
		sendError(w, "Token required", http.StatusUnauthorized)
		return
	}

	claims, err := parseJWT(tokenString)
	if err != nil {
		sendError(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	if r.Method == http.MethodGet {
		var user User
		err = DB.QueryRow(
			"SELECT u.id, u.login, u.email, ud.first_name, ud.last_name "+
				"FROM users u LEFT JOIN user_details ud ON u.id = ud.user_id "+
				"WHERE u.id = $1",
			claims.UserID,
		).Scan(&user.ID, &user.Login, &user.Email, &user.FirstName, &user.LastName)
		if err != nil {
			sendError(w, "User not found", http.StatusNotFound)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(user)
	} else if r.Method == http.MethodPut {
		var user User
		err = json.NewDecoder(r.Body).Decode(&user)
		if err != nil {
			sendError(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		_, err = DB.Exec(
			"UPDATE users SET email = $1 WHERE id = $2",
			user.Email, claims.UserID,
		)
		if err != nil {
			sendError(w, "Failed to update email", http.StatusInternalServerError)
			return
		}

		_, err = DB.Exec(
			"INSERT INTO user_details (user_id, first_name, last_name) VALUES ($1, $2, $3) "+
				"ON CONFLICT (user_id) DO UPDATE SET first_name = $2, last_name = $3",
			claims.UserID, user.FirstName, user.LastName,
		)
		if err != nil {
			sendError(w, "Failed to update user details", http.StatusInternalServerError)
			return
		}

		response := Response{
			Message: "Profile updated successfully",
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	} else {
		sendError(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}
