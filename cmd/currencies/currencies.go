package main

import (
	"github.com/namsral/flag"
	"github.com/skycoin/getsky.org/db"
	"github.com/skycoin/getsky.org/src/currencies"
	"github.com/skycoin/getsky.org/src/util/logger"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	flag.String(flag.DefaultConfigFlagname, "", "path to config file")
	mysqlFlag := flag.String("mysql", "root:root@(0.0.0.0:3306)", "MySQL connect string")
	flag.Parse()

	log := logger.InitLogger()
	sqlDb, err := db.InitDb(*mysqlFlag)
	if err != nil {
		panic(err.Error())
	}

	currStor := db.NewCurrenciesStorage(sqlDb)
	feeder := currencies.NewFeeder(currStor, currencies.CurrencyRateFromConverterAPI)

	log.Info("Starting feed")
	err = feeder.FillRates()
	if err != nil {
		log.Errorf("Error during feeding currencies >>> %s", err.Error())
	} else {
		log.Info("Feed is succeeded")
	}

	defer func() {
		if e, ok := recover().(error); ok {
			log.Errorf("Panic error >>> %s", e.Error())
		}
	}()
}
