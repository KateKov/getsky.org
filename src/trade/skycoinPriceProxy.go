package trade

import (
	"encoding/json"
	"net/http"

	"github.com/skycoin/getsky.org/src/util/httputil"
)

type skycoinPriceResponse struct {
	Code  string `json:"code"`
	Price string `json:"price"`
}

// GetSkycoinPrice returns Skycoin price based on information, received from coinmarketcap.com.
// Method: GET
// Content-type: application/json
// URI: /api/skycoin-price
func GetSkycoinPrice(s *HTTPServer) httputil.APIHandler {
	return func(w http.ResponseWriter, r *http.Request) error {
		currencies := (*s.skycoinPrices).GetAllCurrencies()
		response := make([]skycoinPriceResponse, len(currencies))

		for i, c := range currencies {
			cResponse, err := (*s.skycoinPrices).GetSkycoinPrice(c)
			if err != nil {
				return err
			}
			response[i] = skycoinPriceResponse{Code: c, Price: cResponse}
		}

		return json.NewEncoder(w).Encode(response)
	}
}
