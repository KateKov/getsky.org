package models

// Currency represents an information about country currency
type Currency struct {
	CountryCode  string `db:"CountryCode"`
	CurrencyCode string `db:"CurrencyCode"`
}
