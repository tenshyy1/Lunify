package market

import (
	"github.com/gofiber/fiber/v2"
)

// MarketCoin представляет монету на рынке
type MarketCoin struct {
	Currency  string  `json:"currency"`
	Ticker    string  `json:"ticker"`
	PriceUSD  float64 `json:"price_usd"`
	Change24h float64 `json:"change_24h"`
	Change7d  float64 `json:"change_7d"`
	Category  string  `json:"category"`
}

// routes
func SetupMarketRoutes(app *fiber.App) {
	app.Get("/market/coins", GetMarketCoins)
	app.Get("/market/top-gainers", GetTopGainers)
}

func GetMarketCoins(c *fiber.Ctx) error {
	//change to api
	coins := []MarketCoin{
		{Currency: "Bitcoin", Ticker: "BTC", PriceUSD: 104144.57, Change24h: 12.7, Change7d: 15.2, Category: "Popular"},
		{Currency: "Ethereum", Ticker: "ETH", PriceUSD: 3214.88, Change24h: 9.5, Change7d: 10.3, Category: "Popular"},
		{Currency: "Binance Coin", Ticker: "BNB", PriceUSD: 18204.01, Change24h: 8.3, Change7d: 9.1, Category: "Popular"},
		{Currency: "Tether", Ticker: "USDT", PriceUSD: 6014.63, Change24h: 5.2, Change7d: 6.0, Category: "Popular"},
		{Currency: "Pirl", Ticker: "PIRL", PriceUSD: 3721.32, Change24h: 2.24, Change7d: 8.24, Category: "Metaverse"},
		{Currency: "Mona", Ticker: "MONA", PriceUSD: 5206.94, Change24h: -6.13, Change7d: -6.17, Category: "Entertainment"},
		{Currency: "Zcash", Ticker: "ZEC", PriceUSD: 5206.94, Change24h: 2.24, Change7d: 8.24, Category: "Energy"},
		{Currency: "Cardano", Ticker: "ADA", PriceUSD: 1.23, Change24h: 3.5, Change7d: 4.0, Category: "Popular"},
		{Currency: "Solana", Ticker: "SOL", PriceUSD: 150.45, Change24h: 6.8, Change7d: 7.2, Category: "Popular"},
	}

	category := c.Query("category", "Popular")
	var filteredCoins []MarketCoin
	for _, coin := range coins {
		if coin.Category == category {
			filteredCoins = append(filteredCoins, coin)
		}
	}

	return c.JSON(filteredCoins)
}

func GetTopGainers(c *fiber.Ctx) error {
	//change to api
	topGainers := []MarketCoin{
		{Currency: "Bitcoin", Ticker: "BTC", PriceUSD: 104144.57, Change24h: 12.7, Change7d: 15.2, Category: "Popular"},
		{Currency: "Ethereum", Ticker: "ETH", PriceUSD: 3214.88, Change24h: 9.5, Change7d: 10.3, Category: "Popular"},
		{Currency: "Binance Coin", Ticker: "BNB", PriceUSD: 18204.01, Change24h: 8.3, Change7d: 9.1, Category: "Popular"},
		{Currency: "Tether", Ticker: "USDT", PriceUSD: 6014.63, Change24h: 5.2, Change7d: 6.0, Category: "Popular"},
	}

	return c.JSON(topGainers)
}
