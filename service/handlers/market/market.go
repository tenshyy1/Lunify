package market

import (
	"service/api"
	"service/common"

	"github.com/gofiber/fiber/v2"
)

// Маршруты
func SetupMarketRoutes(app *fiber.App) {
	app.Get("/market/coins", GetMarketCoins)
	app.Get("/market/top-gainers", GetTopGainers)
}

func GetMarketCoins(c *fiber.Ctx) error {
	coins, err := api.FetchMarketCoins(100)
	if err != nil {
		return common.SendError(c, "Failed to fetch coins from API", fiber.StatusInternalServerError)
	}

	tickers := make([]string, len(coins))
	for i, coin := range coins {
		tickers[i] = coin.Ticker
	}
	logoMap, err := api.FetchCoinInfo(tickers)
	if err != nil {
		logoMap = make(map[string]string)
	}

	for i, coin := range coins {
		coins[i].LogoURL = logoMap[coin.Ticker]
	}

	return c.JSON(coins)
}

func GetTopGainers(c *fiber.Ctx) error {
	coins, err := api.FetchMarketCoins(100)
	if err != nil {
		return common.SendError(c, "Failed to fetch coins from API", fiber.StatusInternalServerError)
	}

	for i := 0; i < len(coins)-1; i++ {
		for j := i + 1; j < len(coins); j++ {
			if coins[i].Change24h < coins[j].Change24h {
				coins[i], coins[j] = coins[j], coins[i]
			}
		}
	}
	if len(coins) > 5 {
		coins = coins[:4]
	}

	tickers := make([]string, len(coins))
	for i, coin := range coins {
		tickers[i] = coin.Ticker
	}
	logoMap, err := api.FetchCoinInfo(tickers)
	if err != nil {
		logoMap = make(map[string]string)
	}

	for i, coin := range coins {
		coins[i].LogoURL = logoMap[coin.Ticker]
	}

	return c.JSON(coins)
}
