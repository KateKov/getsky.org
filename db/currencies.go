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
	cmd := `SELECT ` +
		` C.Id, ` +
		` C.CurrencyCode, ` +
		` C.Rate ` +
		` FROM Currencies C`

	err := c.DB.Select(&res, cmd)
	if err != nil {
		return nil, err
	}

	return res, nil
}

// Update updates entire currency row in the db
func (c CurrenciesStorage) Update(cur models.Currency) error {
	cmd := `UPDATE Currencies SET ` +
		` CurrencyCode=:CurrencyCode, ` +
		` Rate=:Rate ` +
		` WHERE Id=:Id `

	_, err := c.DB.NamedExec(cmd, cur)
	return err
}
