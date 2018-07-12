package currencies

import "github.com/skycoin/getsky.org/db/models"

// Currencies provides an access to the currencies storage
type Currencies interface {
	GetAllCurrencies() ([]models.Currency, error)
	Update(models.Currency) error
}
