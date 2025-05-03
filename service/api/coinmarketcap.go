package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"service/common"
)

const (
	apiBaseURL       = "https://pro-api.coinmarketcap.com"
	coinGeckoBaseURL = "https://api.coingecko.com/api/v3"
	apiKey           = "602e29aa-f89f-4fbe-819b-37847531c7f8"
	coinGeckoApiKey  = "CG-jRU5HPtX3hpkvdLMU3i6VsJu"
)

type CoinMarketCapResponse struct {
	Data []struct {
		ID     int    `json:"id"`
		Name   string `json:"name"`
		Symbol string `json:"symbol"`
		Quote  struct {
			USD struct {
				Price            float64 `json:"price"`
				PercentChange24h float64 `json:"percent_change_24h"`
				PercentChange7d  float64 `json:"percent_change_7d"`
			} `json:"usd"`
		} `json:"quote"`
	} `json:"data"`
	Status struct {
		ErrorCode    int    `json:"error_code"`
		ErrorMessage string `json:"error_message"`
	} `json:"status"`
}

type CoinInfoResponse struct {
	Data map[string]struct {
		ID     int    `json:"id"`
		Name   string `json:"name"`
		Symbol string `json:"symbol"`
		Logo   string `json:"logo"`
	} `json:"data"`
	Status struct {
		ErrorCode    int    `json:"error_code"`
		ErrorMessage string `json:"error_message"`
	} `json:"status"`
}

type CategoryResponse struct {
	Data struct {
		Coins []struct {
			ID     int    `json:"id"`
			Name   string `json:"name"`
			Symbol string `json:"symbol"`
			Quote  struct {
				USD struct {
					Price            float64 `json:"price"`
					PercentChange24h float64 `json:"percent_change_24h"`
					PercentChange7d  float64 `json:"percent_change_7d"`
				} `json:"usd"`
			} `json:"quote"`
		} `json:"coins"`
	} `json:"data"`
	Status struct {
		ErrorCode    int    `json:"error_code"`
		ErrorMessage string `json:"error_message"`
	} `json:"status"`
}

// Map categories to CoinMarketCap category IDs
var categoryMapping = map[string]string{
	"metaverse":     "6053dfb66be1bf5c15e865ee", // Metaverse
	"entertainment": "6051a82266fc1b42617d6dc2", // Entertainment
	"energy":        "6051a80666fc1b42617d6d9e", // Energy
	"gaming":        "6051a82166fc1b42617d6dc1", // Gaming
	"music":         "6051a82666fc1b42617d6dc8", // Music
}

// FetchMarketCoins for "Popular" category (top coins by market cap)
func FetchMarketCoins(limit int) ([]common.MarketCoin, error) {
	client := &http.Client{Timeout: 10 * time.Second}
	req, err := http.NewRequest("GET", fmt.Sprintf("%s/v1/cryptocurrency/listings/latest?limit=%d", apiBaseURL, limit), nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("X-CMC_PRO_API_KEY", apiKey)
	req.Header.Set("Accept", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var cmcResp CoinMarketCapResponse
	if err := json.NewDecoder(resp.Body).Decode(&cmcResp); err != nil {
		return nil, err
	}

	if cmcResp.Status.ErrorCode != 0 {
		return nil, fmt.Errorf("API error: %s", cmcResp.Status.ErrorMessage)
	}

	var coins []common.MarketCoin
	for _, coin := range cmcResp.Data {
		coins = append(coins, common.MarketCoin{
			Currency:  coin.Name,
			Ticker:    coin.Symbol,
			PriceUSD:  coin.Quote.USD.Price,
			Change24h: coin.Quote.USD.PercentChange24h,
			Change7d:  coin.Quote.USD.PercentChange7d,
			Category:  "Popular",
		})
	}
	return coins, nil
}

// FetchCoinsByCategory fetches coins for a specific category
func FetchCoinsByCategory(category string, limit int) ([]common.MarketCoin, error) {
	categoryID, exists := categoryMapping[strings.ToLower(category)]
	if !exists {
		return nil, fmt.Errorf("category not supported: %s", category)
	}

	client := &http.Client{Timeout: 10 * time.Second}
	req, err := http.NewRequest("GET", fmt.Sprintf("%s/v1/cryptocurrency/category?id=%s&limit=%d", apiBaseURL, categoryID, limit), nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("X-CMC_PRO_API_KEY", apiKey)
	req.Header.Set("Accept", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var catResp CategoryResponse
	if err := json.NewDecoder(resp.Body).Decode(&catResp); err != nil {
		return nil, err
	}

	if catResp.Status.ErrorCode != 0 {
		return nil, fmt.Errorf("API error: %s", catResp.Status.ErrorMessage)
	}

	var coins []common.MarketCoin
	for _, coin := range catResp.Data.Coins {
		coins = append(coins, common.MarketCoin{
			Currency:  coin.Name,
			Ticker:    coin.Symbol,
			PriceUSD:  coin.Quote.USD.Price,
			Change24h: coin.Quote.USD.PercentChange24h,
			Change7d:  coin.Quote.USD.PercentChange7d,
			Category:  category,
		})
	}
	return coins, nil
}

// FetchCoinPrice fetches current price for a coin
func FetchCoinPrice(ticker string) (float64, error) {
	client := &http.Client{Timeout: 10 * time.Second}
	req, err := http.NewRequest("GET", fmt.Sprintf("%s/v1/cryptocurrency/quotes/latest?symbol=%s", apiBaseURL, ticker), nil)
	if err != nil {
		return 0, err
	}
	req.Header.Set("X-CMC_PRO_API_KEY", apiKey)
	req.Header.Set("Accept", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	var cmcResp struct {
		Data map[string]struct {
			Quote struct {
				USD struct {
					Price float64 `json:"price"`
				} `json:"usd"`
			} `json:"quote"`
		} `json:"data"`
		Status struct {
			ErrorCode    int    `json:"error_code"`
			ErrorMessage string `json:"error_message"`
		} `json:"status"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&cmcResp); err != nil {
		return 0, err
	}

	if cmcResp.Status.ErrorCode != 0 {
		return 0, fmt.Errorf("API error: %s", cmcResp.Status.ErrorMessage)
	}

	coin, exists := cmcResp.Data[ticker]
	if !exists {
		return 0, fmt.Errorf("coin not found: %s", ticker)
	}
	return coin.Quote.USD.Price, nil
}

// FetchCoinInfo fetches metadata like logo for coins
func FetchCoinInfo(tickers []string) (map[string]string, error) {
	client := &http.Client{Timeout: 10 * time.Second}
	tickersStr := strings.Join(tickers, ",")
	req, err := http.NewRequest("GET", fmt.Sprintf("%s/v1/cryptocurrency/info?symbol=%s", apiBaseURL, tickersStr), nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("X-CMC_PRO_API_KEY", apiKey)
	req.Header.Set("Accept", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var cmcResp CoinInfoResponse
	if err := json.NewDecoder(resp.Body).Decode(&cmcResp); err != nil {
		return nil, err
	}

	if cmcResp.Status.ErrorCode != 0 {
		return nil, fmt.Errorf("API error: %s", cmcResp.Status.ErrorMessage)
	}

	logoMap := make(map[string]string)
	for ticker, info := range cmcResp.Data {
		logoMap[ticker] = info.Logo
	}
	return logoMap, nil
}

// FetchCoinPriceHistory fetches 24-hour hourly price history from CoinGecko
func FetchCoinPriceHistory(ticker string) ([]float64, error) {
	client := &http.Client{Timeout: 10 * time.Second}
	url := fmt.Sprintf("%s/coins/%s/market_chart?vs_currency=usd&days=1&interval=hourly", coinGeckoBaseURL, strings.ToLower(ticker))
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("accept", "application/json")
	req.Header.Set("x-cg-pro-api-key", coinGeckoApiKey)

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result struct {
		Prices [][]float64 `json:"prices"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	prices := make([]float64, len(result.Prices))
	for i, priceData := range result.Prices {
		prices[i] = priceData[1] // Цена в USD
	}
	return prices, nil
}
