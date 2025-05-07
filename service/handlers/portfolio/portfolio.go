package portfolio

import (
	"log"
	"strconv"

	"service/api"
	"service/common"
	"service/models"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// routes
func SetupPortfolioRoutes(app *fiber.App, db *gorm.DB) {
	app.Get("/portfolios", GetPortfolios(db))
	app.Post("/portfolios", CreatePortfolio(db))
	app.Delete("/portfolios/:id", DeletePortfolio(db))
	app.Get("/portfolios/:id/coins", GetPortfolioCoins(db))
	app.Post("/portfolios/:id/coins", AddPortfolioCoin(db))
	app.Post("/portfolios/:id/coins/sell", SellPortfolioCoin(db))
}

// return all spisok portofolio
func GetPortfolios(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims, err := common.ParseJWT(c.Get("Authorization"))
		if err != nil {
			return common.SendError(c, "Unauthorized", fiber.StatusUnauthorized)
		}

		// Find portfolios
		var portfolios []models.Portfolio
		if err := db.Where("user_id = ?", claims.UserID).Find(&portfolios).Error; err != nil {
			return common.SendError(c, "Failed to fetch portfolios", fiber.StatusInternalServerError)
		}

		return c.JSON(portfolios)
	}
}

// create portfolio
func CreatePortfolio(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims, err := common.ParseJWT(c.Get("Authorization"))
		if err != nil {
			return common.SendError(c, "Unauthorized", fiber.StatusUnauthorized)
		}

		var input models.Portfolio
		if err := c.BodyParser(&input); err != nil {
			return common.SendError(c, "Invalid input", fiber.StatusBadRequest)
		}

		if input.Name == "" {
			return common.SendError(c, "Name is required", fiber.StatusBadRequest)
		}

		// Create portfolio
		portfolio := models.Portfolio{
			UserID:      uint(claims.UserID),
			Name:        input.Name,
			Description: input.Description,
		}
		if err := db.Create(&portfolio).Error; err != nil {
			return common.SendError(c, "Failed to create portfolio", fiber.StatusInternalServerError)
		}

		return c.JSON(portfolio)
	}
}

// delete portfolio
func DeletePortfolio(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims, err := common.ParseJWT(c.Get("Authorization"))
		if err != nil {
			return common.SendError(c, "Unauthorized", fiber.StatusUnauthorized)
		}

		id, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return common.SendError(c, "Invalid portfolio ID", fiber.StatusBadRequest)
		}

		// Find portfolio
		var portfolio models.Portfolio
		if err := db.Where("id = ? AND user_id = ?", id, claims.UserID).First(&portfolio).Error; err != nil {
			return common.SendError(c, "Portfolio not found or not owned by user", fiber.StatusNotFound)
		}

		// Delete portfolio
		if err := db.Delete(&portfolio).Error; err != nil {
			return common.SendError(c, "Failed to delete portfolio", fiber.StatusInternalServerError)
		}

		return c.JSON(common.Response{
			Message: "Portfolio deleted successfully",
		})
	}
}

// all monet in portfolio
func GetPortfolioCoins(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims, err := common.ParseJWT(c.Get("Authorization"))
		if err != nil {
			return common.SendError(c, "Unauthorized", fiber.StatusUnauthorized)
		}

		id, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return common.SendError(c, "Invalid portfolio ID", fiber.StatusBadRequest)
		}

		// Check portfolio ownership
		var portfolio models.Portfolio
		if err := db.Where("id = ? AND user_id = ?", id, claims.UserID).First(&portfolio).Error; err != nil {
			return common.SendError(c, "Portfolio not found or not owned by user", fiber.StatusNotFound)
		}

		// Find coins
		var coins []models.PortfolioCoin
		if err := db.Where("portfolio_id = ?", id).Find(&coins).Error; err != nil {
			return common.SendError(c, "Failed to fetch coins", fiber.StatusInternalServerError)
		}

		tickers := make([]string, len(coins))
		for i, coin := range coins {
			tickers[i] = coin.Ticker
		}
		logoMap, err := api.FetchCoinInfo(tickers)
		if err != nil {
			log.Printf("Warning: Failed to fetch coin logos: %v", err)
		}

		for i, coin := range coins {
			logoURL, exists := logoMap[coin.Ticker]
			if !exists {
				logoURL = "https://via.placeholder.com/40"
			}
			coins[i].LogoURL = logoURL
		}

		return c.JSON(coins)
	}
}

// add and update portfolio coin
func AddPortfolioCoin(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims, err := common.ParseJWT(c.Get("Authorization"))
		if err != nil {
			return common.SendError(c, "Unauthorized", fiber.StatusUnauthorized)
		}

		id, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return common.SendError(c, "Invalid portfolio ID", fiber.StatusBadRequest)
		}

		var input models.PortfolioCoin
		if err := c.BodyParser(&input); err != nil {
			return common.SendError(c, "Invalid input", fiber.StatusBadRequest)
		}

		if input.Currency == "" || input.Ticker == "" || input.Amount <= 0 {
			return common.SendError(c, "Currency, ticker, and amount are required", fiber.StatusBadRequest)
		}

		// Check portfolio ownership
		var portfolio models.Portfolio
		if err := db.Where("id = ? AND user_id = ?", id, claims.UserID).First(&portfolio).Error; err != nil {
			return common.SendError(c, "Portfolio not found or not owned by user", fiber.StatusNotFound)
		}

		// Fetch coin price
		priceUSD, err := api.FetchCoinPrice(input.Ticker)
		if err != nil {
			return common.SendError(c, "Failed to fetch coin price", fiber.StatusInternalServerError)
		}
		valueUSD := priceUSD * input.Amount

		// Check for existing coin
		var existingCoin models.PortfolioCoin
		if err := db.Where("portfolio_id = ? AND ticker = ?", id, input.Ticker).First(&existingCoin).Error; err == nil {
			// Update existing coin
			existingCoin.Amount += input.Amount
			if existingCoin.ValueUSD != nil {
				*existingCoin.ValueUSD += valueUSD
			} else {
				existingCoin.ValueUSD = &valueUSD
			}
			if err := db.Save(&existingCoin).Error; err != nil {
				return common.SendError(c, "Failed to update coin amount", fiber.StatusInternalServerError)
			}
			return c.JSON(existingCoin)
		}

		// Create new coin
		coin := models.PortfolioCoin{
			PortfolioID:   uint(id),
			Currency:      input.Currency,
			Ticker:        input.Ticker,
			Amount:        input.Amount,
			ValueUSD:      &valueUSD,
			ChangePercent: new(float64),
		}
		if err := db.Create(&coin).Error; err != nil {
			return common.SendError(c, "Failed to add coin", fiber.StatusInternalServerError)
		}

		return c.JSON(coin)
	}
}

// Продажа монеты из портфеля
func SellPortfolioCoin(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims, err := common.ParseJWT(c.Get("Authorization"))
		if err != nil {
			return common.SendError(c, "Unauthorized", fiber.StatusUnauthorized)
		}

		portfolioID, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return common.SendError(c, "Invalid portfolio ID", fiber.StatusBadRequest)
		}

		var input struct {
			Ticker string  `json:"ticker"`
			Amount float64 `json:"amount"`
		}
		if err := c.BodyParser(&input); err != nil {
			return common.SendError(c, "Invalid input", fiber.StatusBadRequest)
		}

		if input.Ticker == "" || input.Amount <= 0 {
			return common.SendError(c, "Ticker and amount are required", fiber.StatusBadRequest)
		}

		// Check portfolio ownership
		var portfolio models.Portfolio
		if err := db.Where("id = ? AND user_id = ?", portfolioID, claims.UserID).First(&portfolio).Error; err != nil {
			return common.SendError(c, "Portfolio not found or not owned by user", fiber.StatusNotFound)
		}

		// Find coin
		var coin models.PortfolioCoin
		if err := db.Where("portfolio_id = ? AND ticker = ?", portfolioID, input.Ticker).First(&coin).Error; err != nil {
			return common.SendError(c, "Coin not found in portfolio", fiber.StatusNotFound)
		}

		if input.Amount > coin.Amount {
			return common.SendError(c, "Not enough coins to sell", fiber.StatusBadRequest)
		}

		// Fetch coin price
		priceUSD, err := api.FetchCoinPrice(input.Ticker)
		if err != nil {
			return common.SendError(c, "Failed to fetch coin price", fiber.StatusInternalServerError)
		}
		valueUSDToSell := priceUSD * input.Amount

		// Update or delete coin
		coin.Amount -= input.Amount
		if coin.ValueUSD != nil {
			*coin.ValueUSD -= valueUSDToSell
		}
		if coin.Amount <= 0 {
			if err := db.Delete(&coin).Error; err != nil {
				return common.SendError(c, "Failed to delete coin", fiber.StatusInternalServerError)
			}
		} else {
			if err := db.Save(&coin).Error; err != nil {
				return common.SendError(c, "Failed to update coin amount", fiber.StatusInternalServerError)
			}
		}

		return c.JSON(common.Response{
			Message: "Coin sold successfully",
		})
	}
}
