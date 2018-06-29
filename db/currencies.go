package db

import (
	"github.com/jmoiron/sqlx"
	"github.com/skycoin/getsky.org/db/models"
)

// CurrenciesStorage provides an access to the DB storage of currencies
type CurrenciesStorage struct {
	DB *sqlx.DB
}

// NewCurrenciesStorage creates a new instance of the NewCurrenciesStorage
func NewCurrenciesStorage(db *sqlx.DB) *CurrenciesStorage {
	return &CurrenciesStorage{
		DB: db,
	}
}

// GetAllCurrencies returns a list of all currencies
func (c CurrenciesStorage) GetAllCurrencies() ([]models.Currency, error) {
	res := []models.Currency{}
	cmd := `SELECT C.CountryCode, ` +
		`C.CurrencyCode ` +
		`FROM Currencies C`

	err := c.DB.Select(&res, cmd)
	if err != nil {
		return nil, err
	}

	return res, nil
}
