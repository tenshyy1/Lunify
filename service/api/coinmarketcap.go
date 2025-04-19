package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"service/common"
)

const (
	apiBaseURL = "https://pro-api.coinmarketcap.com"
	apiKey     = "602e29aa-f89f-4fbe-819b-37847531c7f8"
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
			// Category больше не заполняем на бэкенде
		})
	}
	return coins, nil
}

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

func FetchCoinInfo(tickers []string) (map[string]string, error) {
	client := &http.Client{Timeout: 10 * time.Second}
	tickersStr := ""
	for i, ticker := range tickers {
		if i > 0 {
			tickersStr += ","
		}
		tickersStr += ticker
	}
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
