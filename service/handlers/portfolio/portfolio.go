package portfolio

import (
	"database/sql"
	"strconv"
	"time"

	"service/common"

	"github.com/gofiber/fiber/v2"
)

// routes
func SetupPortfolioRoutes(app *fiber.App) {
	app.Get("/portfolios", GetPortfolios)
	app.Post("/portfolios", CreatePortfolio)
	app.Delete("/portfolios/:id", DeletePortfolio)
	app.Get("/portfolios/:id/coins", GetPortfolioCoins)
	app.Post("/portfolios/:id/coins", AddPortfolioCoin)
	app.Post("/portfolios/:id/coins/sell", SellPortfolioCoin)
}

// return all spisok portofolio
func GetPortfolios(c *fiber.Ctx) error {
	claims, err := common.ParseJWT(c.Get("Authorization"))
	if err != nil {
		return common.SendError(c, "Unauthorized", fiber.StatusUnauthorized)
	}

	rows, err := common.DB.Query("SELECT id, name, description, created_at FROM portfolios WHERE user_id = $1", claims.UserID)
	if err != nil {
		return common.SendError(c, "Failed to fetch portfolios", fiber.StatusInternalServerError)
	}
	defer rows.Close()

	var portfolios []common.Portfolio
	for rows.Next() {
		var p common.Portfolio
		var description sql.NullString
		err := rows.Scan(&p.ID, &p.Name, &description, &p.CreatedAt)
		if err != nil {
			return common.SendError(c, "Failed to scan portfolio", fiber.StatusInternalServerError)
		}
		if description.Valid {
			p.Description = &description.String
		}
		p.UserID = claims.UserID
		portfolios = append(portfolios, p)
	}

	return c.JSON(portfolios)
}

// create portfolio
func CreatePortfolio(c *fiber.Ctx) error {
	claims, err := common.ParseJWT(c.Get("Authorization"))
	if err != nil {
		return common.SendError(c, "Unauthorized", fiber.StatusUnauthorized)
	}

	var input common.Portfolio
	if err := c.BodyParser(&input); err != nil {
		return common.SendError(c, "Invalid input", fiber.StatusBadRequest)
	}

	if input.Name == "" {
		return common.SendError(c, "Name is required", fiber.StatusBadRequest)
	}

	var description sql.NullString
	if input.Description != nil {
		description = sql.NullString{String: *input.Description, Valid: true}
	}

	var createdAt time.Time
	var id int
	err = common.DB.QueryRow(
		"INSERT INTO portfolios (user_id, name, description) VALUES ($1, $2, $3) RETURNING id, created_at",
		claims.UserID, input.Name, description,
	).Scan(&id, &createdAt)
	if err != nil {
		return common.SendError(c, "Failed to create portfolio", fiber.StatusInternalServerError)
	}

	portfolio := common.Portfolio{
		ID:          id,
		UserID:      claims.UserID,
		Name:        input.Name,
		Description: input.Description,
		CreatedAt:   createdAt,
	}
	return c.JSON(portfolio)
}

// delete portfolio
func DeletePortfolio(c *fiber.Ctx) error {
	claims, err := common.ParseJWT(c.Get("Authorization"))
	if err != nil {
		return common.SendError(c, "Unauthorized", fiber.StatusUnauthorized)
	}

	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return common.SendError(c, "Invalid portfolio ID", fiber.StatusBadRequest)
	}

	var userID int
	err = common.DB.QueryRow("SELECT user_id FROM portfolios WHERE id = $1", id).Scan(&userID)
	if err != nil || userID != claims.UserID {
		return common.SendError(c, "Portfolio not found or not owned by user", fiber.StatusNotFound)
	}

	_, err = common.DB.Exec("DELETE FROM portfolio_coins WHERE portfolio_id = $1", id)
	if err != nil {
		return common.SendError(c, "Failed to delete portfolio coins", fiber.StatusInternalServerError)
	}

	_, err = common.DB.Exec("DELETE FROM portfolios WHERE id = $1", id)
	if err != nil {
		return common.SendError(c, "Failed to delete portfolio", fiber.StatusInternalServerError)
	}

	return c.JSON(common.Response{
		Message: "Portfolio deleted successfully",
	})
}

// all monet in portfolio
func GetPortfolioCoins(c *fiber.Ctx) error {
	claims, err := common.ParseJWT(c.Get("Authorization"))
	if err != nil {
		return common.SendError(c, "Unauthorized", fiber.StatusUnauthorized)
	}

	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return common.SendError(c, "Invalid portfolio ID", fiber.StatusBadRequest)
	}

	var userID int
	err = common.DB.QueryRow("SELECT user_id FROM portfolios WHERE id = $1", id).Scan(&userID)
	if err != nil || userID != claims.UserID {
		return common.SendError(c, "Portfolio not found or not owned by user", fiber.StatusNotFound)
	}

	rows, err := common.DB.Query(
		"SELECT id, portfolio_id, currency, ticker, amount, value_usd, change_percent FROM portfolio_coins WHERE portfolio_id = $1",
		id,
	)
	if err != nil {
		return common.SendError(c, "Failed to fetch coins", fiber.StatusInternalServerError)
	}
	defer rows.Close()

	var coins []common.PortfolioCoin
	for rows.Next() {
		var coin common.PortfolioCoin
		var valueUSD, changePercent sql.NullFloat64
		err := rows.Scan(&coin.ID, &coin.PortfolioID, &coin.Currency, &coin.Ticker, &coin.Amount, &valueUSD, &changePercent)
		if err != nil {
			return common.SendError(c, "Failed to scan coin", fiber.StatusInternalServerError)
		}
		coin.ValueUSD = valueUSD.Float64
		coin.ChangePercent = changePercent.Float64
		coins = append(coins, coin)
	}

	return c.JSON(coins)
}

// add and update portfolio coin
func AddPortfolioCoin(c *fiber.Ctx) error {
	claims, err := common.ParseJWT(c.Get("Authorization"))
	if err != nil {
		return common.SendError(c, "Unauthorized", fiber.StatusUnauthorized)
	}

	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return common.SendError(c, "Invalid portfolio ID", fiber.StatusBadRequest)
	}

	var input common.PortfolioCoin
	if err := c.BodyParser(&input); err != nil {
		return common.SendError(c, "Invalid input", fiber.StatusBadRequest)
	}

	if input.Currency == "" || input.Ticker == "" || input.Amount <= 0 {
		return common.SendError(c, "Currency, ticker, and amount are required", fiber.StatusBadRequest)
	}

	var userID int
	err = common.DB.QueryRow("SELECT user_id FROM portfolios WHERE id = $1", id).Scan(&userID)
	if err != nil || userID != claims.UserID {
		return common.SendError(c, "Portfolio not found or not owned by user", fiber.StatusNotFound)
	}

	//calculate price monet
	priceUSD, err := common.GetMarketCoinPrice(input.Ticker)
	if err != nil {
		return common.SendError(c, "Failed to fetch coin price", fiber.StatusInternalServerError)
	}
	valueUSD := priceUSD * input.Amount

	var existingCoinID int
	var existingAmount, existingValueUSD float64
	err = common.DB.QueryRow(
		"SELECT id, amount, value_usd FROM portfolio_coins WHERE portfolio_id = $1 AND ticker = $2",
		id, input.Ticker,
	).Scan(&existingCoinID, &existingAmount, &existingValueUSD)

	if err == sql.ErrNoRows {
		_, err = common.DB.Exec(
			"INSERT INTO portfolio_coins (portfolio_id, currency, ticker, amount, value_usd, change_percent) VALUES ($1, $2, $3, $4, $5, $6)",
			id, input.Currency, input.Ticker, input.Amount, valueUSD, 0.0,
		)
		if err != nil {
			return common.SendError(c, "Failed to add coin", fiber.StatusInternalServerError)
		}

		err = common.DB.QueryRow("SELECT id FROM portfolio_coins WHERE id = (SELECT currval('portfolio_coins_id_seq'))").Scan(&existingCoinID)
		if err != nil {
			return common.SendError(c, "Failed to fetch created coin", fiber.StatusInternalServerError)
		}
	} else if err != nil {
		return common.SendError(c, "Failed to check existing coin", fiber.StatusInternalServerError)
	} else {
		newAmount := existingAmount + input.Amount
		newValueUSD := existingValueUSD + valueUSD
		_, err = common.DB.Exec(
			"UPDATE portfolio_coins SET amount = $1, value_usd = $2 WHERE id = $3",
			newAmount, newValueUSD, existingCoinID,
		)
		if err != nil {
			return common.SendError(c, "Failed to update coin amount", fiber.StatusInternalServerError)
		}
	}

	coin := common.PortfolioCoin{
		ID:            existingCoinID,
		PortfolioID:   id,
		Currency:      input.Currency,
		Ticker:        input.Ticker,
		Amount:        input.Amount,
		ValueUSD:      valueUSD,
		ChangePercent: 0.0,
	}
	return c.JSON(coin)
}

// delete monet in portfolio
func SellPortfolioCoin(c *fiber.Ctx) error {
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

	var userID int
	err = common.DB.QueryRow("SELECT user_id FROM portfolios WHERE id = $1", portfolioID).Scan(&userID)
	if err != nil || userID != claims.UserID {
		return common.SendError(c, "Portfolio not found or not owned by user", fiber.StatusNotFound)
	}
	var coinID int
	var currentAmount, currentValueUSD float64
	err = common.DB.QueryRow(
		"SELECT id, amount, value_usd FROM portfolio_coins WHERE portfolio_id = $1 AND ticker = $2",
		portfolioID, input.Ticker,
	).Scan(&coinID, &currentAmount, &currentValueUSD)
	if err == sql.ErrNoRows {
		return common.SendError(c, "Coin not found in portfolio", fiber.StatusNotFound)
	} else if err != nil {
		return common.SendError(c, "Failed to check coin", fiber.StatusInternalServerError)
	}

	if input.Amount > currentAmount {
		return common.SendError(c, "Not enough coins to sell", fiber.StatusBadRequest)
	}

	priceUSD, err := common.GetMarketCoinPrice(input.Ticker)
	if err != nil {
		return common.SendError(c, "Failed to fetch coin price", fiber.StatusInternalServerError)
	}
	valueUSDToSell := priceUSD * input.Amount

	newAmount := currentAmount - input.Amount
	newValueUSD := currentValueUSD - valueUSDToSell

	if newAmount <= 0 {
		_, err = common.DB.Exec("DELETE FROM portfolio_coins WHERE id = $1", coinID)
		if err != nil {
			return common.SendError(c, "Failed to delete coin", fiber.StatusInternalServerError)
		}
	} else {
		_, err = common.DB.Exec("UPDATE portfolio_coins SET amount = $1, value_usd = $2 WHERE id = $3", newAmount, newValueUSD, coinID)
		if err != nil {
			return common.SendError(c, "Failed to update coin amount", fiber.StatusInternalServerError)
		}
	}

	return c.JSON(common.Response{
		Message: "Coin sold successfully",
	})
}
