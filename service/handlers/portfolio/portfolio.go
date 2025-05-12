package portfolio

import (
	"errors"
	"strconv"

	"service/api"
	"service/common"
	"service/models"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// portfolio routes
func SetupPortfolioRoutes(app *fiber.App, db *gorm.DB) {
	app.Get("/portfolios", GetPortfolios(db))
	app.Post("/portfolios", CreatePortfolio(db))
	app.Delete("/portfolios/:id", DeletePortfolio(db))
	app.Get("/portfolios/:id/coins", GetPortfolioCoins(db))
	app.Post("/portfolios/:id/coins", AddPortfolioCoin(db))
	app.Post("/portfolios/:id/coins/sell", SellPortfolioCoin(db))
}

// GetPortfolios returns all portfolios
func GetPortfolios(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims, err := common.ParseJWT(c.Get("Authorization"))
		if err != nil {
			return common.SendError(c, "Unauthorized", fiber.StatusUnauthorized)
		}

		var portfolios []models.Portfolio
		if err := db.Where("user_id = ?", claims.UserID).Find(&portfolios).Error; err != nil {
			return common.SendError(c, "Failed to fetch portfolios", fiber.StatusInternalServerError)
		}

		// Update total_value
		for _, portfolio := range portfolios {
			if err := updatePortfolioTotalValue(db, portfolio.ID); err != nil {
				return common.SendError(c, "Failed to update portfolio total value", fiber.StatusInternalServerError)
			}
		}

		// Fetch portfolios
		if err := db.Where("user_id = ?", claims.UserID).Find(&portfolios).Error; err != nil {
			return common.SendError(c, "Failed to fetch portfolios", fiber.StatusInternalServerError)
		}

		return c.JSON(portfolios)
	}
}

// CreatePortfolio
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

		portfolio := models.Portfolio{
			UserID:      uint(claims.UserID),
			Name:        input.Name,
			Description: input.Description,
			TotalValue:  new(float64),
		}
		if err := db.Create(&portfolio).Error; err != nil {
			return common.SendError(c, "Failed to create portfolio", fiber.StatusInternalServerError)
		}

		return c.JSON(portfolio)
	}
}

// deletes a portfolio
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

		var portfolio models.Portfolio
		if err := db.Where("id = ? AND user_id = ?", id, claims.UserID).First(&portfolio).Error; err != nil {
			return common.SendError(c, "Portfolio not found or not owned by user", fiber.StatusNotFound)
		}

		if err := db.Delete(&portfolio).Error; err != nil {
			return common.SendError(c, "Failed to delete portfolio", fiber.StatusInternalServerError)
		}

		return c.JSON(common.Response{
			Message: "Portfolio deleted successfully",
		})
	}
}

// updatePortfolioCoinPrices updates coin prices and change percentages
func updatePortfolioCoinPrices(db *gorm.DB, coins []models.PortfolioCoin) error {
	tickers := make([]string, 0, len(coins))
	for _, coin := range coins {
		if coin.Ticker != "" {
			tickers = append(tickers, coin.Ticker)
		}
	}

	marketCoins, err := api.FetchMarketCoins(500)
	if err != nil {
		return err
	}

	tickerPriceMap := make(map[string]struct {
		PriceUSD  float64
		Change24h float64
	})
	for _, marketCoin := range marketCoins {
		tickerPriceMap[marketCoin.Ticker] = struct {
			PriceUSD  float64
			Change24h float64
		}{
			PriceUSD:  marketCoin.PriceUSD,
			Change24h: marketCoin.Change24h,
		}
	}

	for i, coin := range coins {
		if data, exists := tickerPriceMap[coin.Ticker]; exists {
			newValueUSD := data.PriceUSD * coin.Amount
			coins[i].ValueUSD = &newValueUSD
			coins[i].ChangePercent = &data.Change24h
			if err := db.Save(&coin).Error; err != nil {
				return err
			}
		}
	}

	return nil
}

// returns all coins in a portfolio with updated prices
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

		var portfolio models.Portfolio
		if err := db.Where("id = ? AND user_id = ?", id, claims.UserID).First(&portfolio).Error; err != nil {
			return common.SendError(c, "Portfolio not found or not owned by user", fiber.StatusNotFound)
		}

		var coins []models.PortfolioCoin
		if err := db.Where("portfolio_id = ?", id).Find(&coins).Error; err != nil {
			return common.SendError(c, "Failed to fetch coins", fiber.StatusInternalServerError)
		}

		if err := updatePortfolioCoinPrices(db, coins); err != nil {

		}

		if err := updatePortfolioTotalValue(db, uint(id)); err != nil {
			return common.SendError(c, "Failed to update portfolio total value", fiber.StatusInternalServerError)
		}

		if err := db.First(&portfolio, id).Error; err != nil {
			return common.SendError(c, "Failed to fetch updated portfolio", fiber.StatusInternalServerError)
		}

		tickers := make([]string, 0, len(coins))
		for _, coin := range coins {
			if coin.Ticker != "" {
				tickers = append(tickers, coin.Ticker)
			}
		}
		logoMap, err := api.FetchCoinInfo(tickers)
		if err != nil {
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

// updates the total value of a portfolio
func updatePortfolioTotalValue(db *gorm.DB, portfolioID uint) error {
	var coins []models.PortfolioCoin
	if err := db.Where("portfolio_id = ?", portfolioID).Find(&coins).Error; err != nil {
		return err
	}

	totalValue := 0.0
	for _, coin := range coins {
		if coin.ValueUSD != nil {
			totalValue += *coin.ValueUSD
		}
	}

	var portfolio models.Portfolio
	if err := db.First(&portfolio, portfolioID).Error; err != nil {
		return err
	}

	//
	if portfolio.TotalValue == nil {
		portfolio.TotalValue = new(float64)
	}
	*portfolio.TotalValue = totalValue
	if err := db.Save(&portfolio).Error; err != nil {
		return err
	}

	return nil
}

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

		var portfolio models.Portfolio
		if err := db.Where("id = ? AND user_id = ?", id, claims.UserID).First(&portfolio).Error; err != nil {
			return common.SendError(c, "Portfolio not found or not owned by user", fiber.StatusNotFound)
		}

		priceUSD, err := api.FetchCoinPrice(input.Ticker)
		if err != nil {
			return common.SendError(c, "Failed to fetch coin price", fiber.StatusInternalServerError)
		}
		valueUSD := priceUSD * input.Amount

		var existingCoin models.PortfolioCoin
		err = db.Where("portfolio_id = ? AND ticker = ?", id, input.Ticker).First(&existingCoin).Error
		if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
			return common.SendError(c, "Failed to check existing coin", fiber.StatusInternalServerError)
		}

		if err == nil {
			existingCoin.Amount += input.Amount
			if existingCoin.ValueUSD != nil {
				*existingCoin.ValueUSD += valueUSD
			} else {
				existingCoin.ValueUSD = &valueUSD
			}
			if err := db.Save(&existingCoin).Error; err != nil {
				return common.SendError(c, "Failed to update coin amount", fiber.StatusInternalServerError)
			}
			if err := updatePortfolioTotalValue(db, uint(id)); err != nil {
				return common.SendError(c, "Failed to update portfolio total value", fiber.StatusInternalServerError)
			}

			return c.JSON(existingCoin)
		}

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

		if err := updatePortfolioTotalValue(db, uint(id)); err != nil {
			return common.SendError(c, "Failed to update portfolio total value", fiber.StatusInternalServerError)
		}

		return c.JSON(coin)
	}
}

// SellPortfolioCoin sells a coin from a portfolio
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

		var portfolio models.Portfolio
		if err := db.Where("id = ? AND user_id = ?", portfolioID, claims.UserID).First(&portfolio).Error; err != nil {
			return common.SendError(c, "Portfolio not found or not owned by user", fiber.StatusNotFound)
		}

		var coin models.PortfolioCoin
		err = db.Where("portfolio_id = ? AND ticker = ?", portfolioID, input.Ticker).First(&coin).Error
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return common.SendError(c, "Coin not found in portfolio", fiber.StatusNotFound)
			}
			return common.SendError(c, "Failed to find coin", fiber.StatusInternalServerError)
		}

		if input.Amount > coin.Amount {
			return common.SendError(c, "Not enough coins to sell", fiber.StatusBadRequest)
		}

		priceUSD, err := api.FetchCoinPrice(input.Ticker)
		if err != nil {
			return common.SendError(c, "Failed to fetch coin price", fiber.StatusInternalServerError)
		}
		valueUSDToSell := priceUSD * input.Amount

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

		if err := updatePortfolioTotalValue(db, uint(portfolioID)); err != nil {
			return common.SendError(c, "Failed to update portfolio total value", fiber.StatusInternalServerError)
		}

		return c.JSON(common.Response{
			Message: "Coin sold successfully",
		})
	}
}
