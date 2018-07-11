package currencies

const baseCurrency = "USD"

// Feeder fills app db by new rates
type Feeder interface {
	FillRates() error
}

type feed struct {
	cs     Currencies
	curAPI CurrencyRatesGetter
}

// NewFeeder returns a new Feeder
func NewFeeder(cs Currencies, curAPI CurrencyRatesGetter) Feeder {
	return feed{cs, curAPI}
}

// FillRates fills database by new currency rates
func (f feed) FillRates() error {
	appCurrencies, err := f.cs.GetAllCurrencies()
	if err != nil {
		return err
	}

	curStr := make([]string, len(appCurrencies))
	for i, cur := range appCurrencies {
		curStr[i] = cur.CurrencyCode
	}

	rates, err := f.curAPI(baseCurrency, curStr)
	if err != nil {
		return err
	}

	for i, r := range rates {
		appCurrencies[i].Rate = r.Rate
		err := f.cs.Update(appCurrencies[i])
		if err != nil {
			return err
		}
	}

	return nil
}
