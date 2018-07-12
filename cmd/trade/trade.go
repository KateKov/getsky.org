package main

import (
	"github.com/namsral/flag"
	"github.com/skycoin/getsky.org/db"
	"github.com/skycoin/getsky.org/src/mail"
	"github.com/skycoin/getsky.org/src/skycoinPrice"
	"github.com/skycoin/getsky.org/src/trade"
	"github.com/skycoin/getsky.org/src/util/logger"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	flag.String(flag.DefaultConfigFlagname, "", "path to config file")
	bindingFlag := flag.String("binding", "0.0.0.0:8081", "HTTP server binding")
	mysqlFlag := flag.String("mysql", "root:root@(0.0.0.0:3306)", "MySQL connect string")
	recaptchaSecret := flag.String("recaptchaSecret", "6LcIDlkUAAAAAB7-YebjJSUBb2aINasOnNk0zF8W", "reCaptcha secret key")

	mailHost := flag.String("mailHost", "postfix:25", "SMTP server")
	mailFromAddress := flag.String("mailFromAddress", "noreply@getsky.org", "From address for email")
	mailUsername := flag.String("mailUsername", "test@email.com", "SMTP server user")
	mailPassword := flag.String("mailPassword", "password", "SMTP server password")
	feedbackAddress := flag.String("feedbackAddress", "test2@email.com", "Feedback email address")

	flag.Parse()

	log := logger.InitLogger()

	sqlDb, err := db.InitDb(*mysqlFlag)
	if err != nil {
		panic(err.Error())
	}

	currencies := db.NewCurrenciesStorage(sqlDb)
	auth := db.NewAuthenticator(sqlDb)
	storage := db.NewStorage(sqlDb)
	users := db.NewUsers(sqlDb)
	geo := db.NewGeo(sqlDb)
	messages := db.NewMessages(sqlDb)
	skycoinPrices := skycoinPrice.NewSkycoinPrices(currencies)
	mailer := mail.NewPostfixMailer(*mailHost, *mailUsername, *mailPassword, *feedbackAddress, *mailFromAddress, log)
	skycoinPricesInterface := skycoinPrice.Service(skycoinPrices)

	server := trade.NewHTTPServer(*recaptchaSecret, *bindingFlag, storage, users, auth, log, geo, messages, mailer, &skycoinPricesInterface)
	skycoinPrices.StartUpdatingCycle()

	if err := server.Run(); err != nil {
		panic(err.Error())
	}
}
