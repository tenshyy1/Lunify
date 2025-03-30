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
	ID       int    `json:"id"`
	Login    string `json:"login"`
	Password string `json:"password"`
	Email    string `json:"email,omitempty"`
}

type Response struct {
	Message string `json:"message"`
	Token   string `json:"token,omitempty"`
}

type ErrorResponse struct {
	Message string `json:"message"`
}

type Claims struct {
	UserID int `json:"userламиd"`
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

func isTokenRevoked(tokenString string) bool {
	var exists bool
	err := DB.QueryRow("SELECT EXISTS(SELECT 1 FROM revoked_tokens WHERE token = $1)", tokenString).Scan(&exists)
	return err == nil && exists
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

// register
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

// login
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

// logout
func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		sendError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	tokenString := r.Header.Get("Authorization")
	if tokenString == "" {
		sendError(w, "Token required", http.StatusUnauthorized)
		return
	}

	_, err := DB.Exec("INSERT INTO revoked_tokens (token) VALUES ($1)", tokenString)
	if err != nil {
		sendError(w, "Failed to revoke token", http.StatusInternalServerError)
		return
	}

	response := Response{
		Message: "Successfully logged out",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// change profile
func ProfileHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		sendError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	tokenString := r.Header.Get("Authorization")
	if tokenString == "" {
		sendError(w, "Token required", http.StatusUnauthorized)
		return
	}

	if isTokenRevoked(tokenString) {
		sendError(w, "Token revoked", http.StatusUnauthorized)
		return
	}

	claims, err := parseJWT(tokenString)
	if err != nil {
		sendError(w, "Invalid token", http.StatusUnauthorized)
		return
	}

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
		sendError(w, "Failed to update profile", http.StatusInternalServerError)
		return
	}

	response := Response{
		Message: "Profile updated successfully",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
