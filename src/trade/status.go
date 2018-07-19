package trade

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/skycoin/getsky.org/src/util/httputil"
)

type statusResponse struct {
	DbStatus               string `json:"dbStatus"`
	CoinMarketCapStatus    string `json:"coinMarketCapStatus"`
	MarketCapLastUpdatedAt string `json:"marketCapLastUpdatedAt"`
}

// StatusHandler shows current status of the system
// Method: GET
// Content-type: application/json
// URI: /api/status
func StatusHandler(s *HTTPServer) httputil.APIHandler {
	return func(w http.ResponseWriter, r *http.Request) error {
		dbStatus := "OK"
		if err := s.board.GetDBStatus(); err != nil {
			dbStatus = fmt.Sprintf("%s", err)
		}
		status := &statusResponse{
			DbStatus:               dbStatus,
			CoinMarketCapStatus:    "OK",
			MarketCapLastUpdatedAt: (*s.skycoinPrices).GetLastUpdateTime().UTC().Format(time.RFC3339),
		}

		return json.NewEncoder(w).Encode(status)
	}
}
