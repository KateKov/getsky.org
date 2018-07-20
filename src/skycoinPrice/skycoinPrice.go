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

	"github.com/skycoin/getsky.org/src/currencies"
)

const refreshInterval = time.Minute * 5
const apiRequestsLimitPerMinute = 30

// Service provides a logic of retrieving Skycoin prices
type Service interface {
	GetSkycoinPrice(currency string) (string, error)
	GetAllCurrencies() []string
	GetLastUpdateTime() time.Time
}

// SkycoinPrice represents a cached value of the skycoin price
type SkycoinPrice struct {
	price string
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

	currencies *currencies.Currencies
}

// NewSkycoinPrices creates a new instance of the SkycoinPrices
func NewSkycoinPrices(currencies currencies.Currencies) *SkycoinPrices {
	return &SkycoinPrices{
		prices:     make(map[string]*SkycoinPrice),
		stop:       make(chan string, 1),
		quit:       make(chan os.Signal, 1),
		currencies: &currencies,
	}
}

// GetSkycoinPrice returns a skycon price
func (prices SkycoinPrices) GetSkycoinPrice(currency string) (string, error) {
	if val, exists := prices.prices[currency]; exists {
		return val.price, nil
	}
	return "", errors.New("Specified currency doesn't exists")
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

func updatePrices(prices *SkycoinPrices, currenciesProvider *currencies.Currencies) {
rootLoop:
	for {
		currencies, err := (*currenciesProvider).GetAllCurrencies()
		if err != nil {
			fmt.Println(err)
			continue
		}
		for _, c := range currencies {
			resp, err := getNewPrice(c.CurrencyCode)
			time.Sleep((apiRequestsLimitPerMinute / 60) * time.Second)
			if err != nil {
				continue
			}
			if v, exists := prices.prices[c.CurrencyCode]; exists {
				v.price = resp
			}
			prices.prices[c.CurrencyCode] = &SkycoinPrice{price: resp}
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
	go updatePrices(prices, prices.currencies)

	go func() {
		<-prices.quit
		prices.StopUpdatingCycle()
	}()
}

// StopUpdatingCycle stops cycle
func (prices SkycoinPrices) StopUpdatingCycle() {
	prices.stop <- "STOP"
}
