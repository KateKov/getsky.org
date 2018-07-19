package skycoinPrice

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/shopspring/decimal"
	"github.com/skycoin/getsky.org/src/currencies"
)

const refreshInterval = time.Minute * 5
const baseCurrency = "USD"

// Service provides a logic of retrieving Skycoin prices
type Service interface {
	GetSkycoinPrice(currency string) (*decimal.Decimal, error)
	GetAllCurrencies() []string
	GetLastUpdateTime() time.Time
}

// SkycoinPrice represents a cached value of the skycoin price
type SkycoinPrice struct {
	price decimal.Decimal
}

// NewSkycoinPrice creates a new instance of SkycoinPrice
func NewSkycoinPrice() *SkycoinPrice {
	return &SkycoinPrice{}
}

func getNewPrice(currency string) (string, error) {
	resp, err := http.Get("https://api.coinmarketcap.com/v1/ticker/skycoin/?convert=" + currency)
	if err != nil {
		return "", err
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	var objmap []map[string]string
	err = json.Unmarshal(body, &objmap)
	if err != nil {
		return "", err
	}

	value := objmap[0]["price_"+strings.ToLower(currency)]

	return value, nil
}

// SkycoinPrices represents a storage of all cached values of the Skycoin price
type SkycoinPrices struct {
	prices         map[string]*SkycoinPrice
	stop           chan string
	quit           chan os.Signal
	lastUpdateTime time.Time

	curAPI currencies.CurrencyRatesGetter

	currencies *currencies.Currencies
}

// NewSkycoinPrices creates a new instance of the SkycoinPrices
func NewSkycoinPrices(currencies currencies.Currencies, curAPI currencies.CurrencyRatesGetter) *SkycoinPrices {
	return &SkycoinPrices{
		prices:     make(map[string]*SkycoinPrice),
		stop:       make(chan string, 1),
		quit:       make(chan os.Signal, 1),
		currencies: &currencies,
		curAPI:     curAPI,
	}
}

// GetSkycoinPrice returns a skycon price
func (prices SkycoinPrices) GetSkycoinPrice(currency string) (*decimal.Decimal, error) {
	if val, exists := prices.prices[currency]; exists {
		return &val.price, nil
	}
	return nil, errors.New("Specified currency doesn't exists")
}

// GetAllCurrencies returns all currencies codes
func (prices SkycoinPrices) GetAllCurrencies() []string {
	currenciesCodes := make([]string, 0, len(prices.prices))
	for k := range prices.prices {
		currenciesCodes = append(currenciesCodes, k)
	}
	return currenciesCodes
}

// GetLastUpdateTime returns time of the last update of prices
func (prices SkycoinPrices) GetLastUpdateTime() time.Time {
	return prices.lastUpdateTime
}

func updatePrices(prices *SkycoinPrices) {
rootLoop:
	for {
		currencies, err := (*prices.currencies).GetAllCurrencies()

		if err != nil {
			fmt.Println(err)
			continue
		}

		baseCurrencyPrice, err := getNewPrice(baseCurrency)
		if err != nil {
			continue
		}
		parsedPrice, err := decimal.NewFromString(baseCurrencyPrice)
		if err != nil {
			continue
		}
		prices.prices[baseCurrency] = &SkycoinPrice{price: parsedPrice}

		curStr := make([]string, len(currencies))
		for i, cur := range currencies {
			curStr[i] = cur.CurrencyCode
		}

		rates, err := prices.curAPI(baseCurrency, curStr)
		if err != nil {
			fmt.Println(err)
			continue
		}
		for _, r := range rates {
			if r.Currency == baseCurrency {
				continue
			}
			prices.prices[r.Currency] = &SkycoinPrice{price: parsedPrice.Mul(r.Rate)}
		}

		prices.lastUpdateTime = time.Now()
		select {
		case <-prices.stop:
			break rootLoop
		case <-time.After(refreshInterval):
			continue
		}
	}
}

// StartUpdatingCycle starts cycle that requests prices from the remote server
func (prices *SkycoinPrices) StartUpdatingCycle() {
	go updatePrices(prices)

	go func() {
		<-prices.quit
		prices.StopUpdatingCycle()
	}()
}

// StopUpdatingCycle stops cycle
func (prices SkycoinPrices) StopUpdatingCycle() {
	prices.stop <- "STOP"
}
