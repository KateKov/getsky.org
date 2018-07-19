package currencies

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/shopspring/decimal"
)

// RateResult respresents result of getting a currency from remote server
type RateResult struct {
	Currency string
	Rate     decimal.Decimal
	Err      error
}

// CurrencyRatesGetter returns a slice of RateResult
type CurrencyRatesGetter func(base string, targetsCurrencies []string) ([]RateResult, error)

// CurrencyRateFromConverterAPI gets a rate of a pair of currencies from currencyconverterapi
func CurrencyRateFromConverterAPI(base string, targetsCurrencies []string) ([]RateResult, error) {
	res := make([]RateResult, len(targetsCurrencies))

	for i, currency := range targetsCurrencies {
		res[i].Currency = currency
		rate, err := converterAPI(base, currency)
		res[i].Err = err
		res[i].Rate = rate
	}

	return res, nil
}

func converterAPI(base string, target string) (decimal.Decimal, error) {
	curPair := fmt.Sprintf("%s_%s", base, target)
	url := fmt.Sprintf("http://free.currencyconverterapi.com/api/v5/convert?q=%s&compact=y", curPair)
	resp, err := http.Get(url)
	if err != nil {
		return decimal.Zero, err
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return decimal.Zero, err
	}

	var objmap map[string]map[string]decimal.Decimal
	err = json.Unmarshal(body, &objmap)
	if err != nil {
		fmt.Println("converterAPI >", target, string(body))
		return decimal.Zero, err
	}

	value := objmap[curPair]["val"]
	return value, nil
}
