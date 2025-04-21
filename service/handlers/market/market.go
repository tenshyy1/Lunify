package market

import (
	"log"
	"strings"
	"sync"
	"time"

	"service/api"
	"service/common"

	"github.com/gofiber/fiber/v2"
)

// Cache structure and globals
type cacheEntry struct {
	data      []common.MarketCoin
	expiresAt time.Time
}

var (
	coinCache     = sync.Map{}
	cacheDuration = 30 * time.Second
)

// Setup routes
func SetupMarketRoutes(app *fiber.App) {
	app.Get("/market/coins", GetMarketCoins)
	app.Get("/market/top-gainers", GetTopGainers)
}

// Fetch coins by category
func GetMarketCoins(c *fiber.Ctx) error {
	category := strings.ToLower(c.Query("category", "popular"))
	limit := 150

	if cached, exists := coinCache.Load(category); exists {
		entry := cached.(cacheEntry)
		if time.Now().Before(entry.expiresAt) {
			return c.JSON(entry.data)
		}
		coinCache.Delete(category)
	}

	var coins []common.MarketCoin
	var err error

	if category == "popular" {
		coins, err = api.FetchMarketCoins(limit)
	} else {
		coins, err = api.FetchCoinsByCategory(category, limit)
	}
	if err != nil {
		return common.SendError(c, "Failed to fetch coins from API: "+err.Error(), fiber.StatusInternalServerError)
	}

	// Fetch and apply logos
	tickers := make([]string, len(coins))
	for i, coin := range coins {
		tickers[i] = coin.Ticker
	}
	logoMap, err := api.FetchCoinInfo(tickers)
	if err != nil {
		log.Printf("Failed to fetch logos for category %s: %v", category, err)
		logoMap = make(map[string]string)
	}

	for _, ticker := range tickers {
		if logoMap[ticker] == "" {
			log.Printf("Missing logo for ticker %s in category %s", ticker, category)
		}
	}

	for i, coin := range coins {
		logoURL := logoMap[coin.Ticker]
		if logoURL == "" {
			logoURL = ""
		}
		coins[i].LogoURL = logoURL
	}

	// Cache results
	coinCache.Store(category, cacheEntry{
		data:      coins,
		expiresAt: time.Now().Add(cacheDuration),
	})

	return c.JSON(coins)
}

// Fetch top gainers
func GetTopGainers(c *fiber.Ctx) error {
	if cached, exists := coinCache.Load("top-gainers"); exists {
		entry := cached.(cacheEntry)
		if time.Now().Before(entry.expiresAt) {
			return c.JSON(entry.data)
		}
		coinCache.Delete("top-gainers")
	}

	coins, err := api.FetchMarketCoins(100)
	if err != nil {
		return common.SendError(c, "Failed to fetch coins from API", fiber.StatusInternalServerError)
	}

	// Sort by 24h change
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

	// Fetch and apply logos
	tickers := make([]string, len(coins))
	for i, coin := range coins {
		tickers[i] = coin.Ticker
	}
	logoMap, err := api.FetchCoinInfo(tickers)
	if err != nil {
		log.Printf("Failed to fetch logos for top gainers: %v", err)
		logoMap = make(map[string]string)
	}

	for _, ticker := range tickers {
		if logoMap[ticker] == "" {
			log.Printf("Missing logo for ticker %s in top gainers", ticker)
		}
	}

	for i, coin := range coins {
		logoURL := logoMap[coin.Ticker]
		if logoURL == "" {
			logoURL = ""
		}
		coins[i].LogoURL = logoURL
	}

	// Cache results
	coinCache.Store("top-gainers", cacheEntry{
		data:      coins,
		expiresAt: time.Now().Add(cacheDuration),
	})

	return c.JSON(coins)
}
