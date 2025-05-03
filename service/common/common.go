package common

import (
	"errors"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

var jwtKey = []byte("my_secret_key")

// MarketCoin for external market data
type MarketCoin struct {
	Currency     string    `json:"currency"`
	Ticker       string    `json:"ticker"`
	PriceUSD     float64   `json:"price_usd"`
	Change24h    float64   `json:"change_24h"`
	Change7d     float64   `json:"change_7d"`
	Category     string    `json:"category"`
	LogoURL      string    `json:"logo_url,omitempty"`
	PriceHistory []float64 `json:"price_history,omitempty"`
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

func GenerateToken(userID int) (string, error) {
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

func ParseJWT(tokenString string) (*Claims, error) {
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

func SendError(c *fiber.Ctx, message string, statusCode int) error {
	return c.Status(statusCode).JSON(ErrorResponse{Message: message})
}

func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

func ComparePassword(hashedPassword, password string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}
