package models

import (
	"github.com/shopspring/decimal"
)

// Currency represents an information about country currency
type Currency struct {
	ID           int64           `db:"Id"`
	CurrencyCode string          `db:"CurrencyCode"`
	Rate         decimal.Decimal `db:"Rate"`
}
