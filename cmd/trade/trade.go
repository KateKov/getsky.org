package main

import (
	"fmt"

	"github.com/namsral/flag"
	"github.com/skycoin/getsky.org/db"
	"github.com/skycoin/getsky.org/src"
	"github.com/skycoin/getsky.org/src/mail"
	"github.com/skycoin/getsky.org/src/skycoinPrice"
	"github.com/skycoin/getsky.org/src/trade"
	"github.com/skycoin/getsky.org/src/util/logger"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	fmt.Println("Current version: ", src.VERSION)

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

	// SWH: NewPostfixMailer does not work with gmail or vidahost.  It is not correct to hard code external evironment dependencies in source.
	// A better solution is to have one mail handing client which works with either service based on the settings/paramenters.  E.g. add a param "usetls" or similar.
	// I have switched it back to using the original "gmail" smtp handler, which also works for vidahost.  This will break the current postfix docker setup. The solution is to either:
	//   a) change the docker postfix server to use plain auth (in the postfix server settings)
	//   b) add features to the existing mail service client code to handle both (e.g. do something different baserd on port, or a new settting)
	//	mailer := mail.NewPostfixMailer(*mailHost, *mailUsername, *mailPassword, *feedbackAddress, *mailFromAddress, log)
	mailer := mail.NewGmailMailer(*mailHost, *mailUsername, *mailPassword, *feedbackAddress, *mailFromAddress, log)
	skycoinPricesInterface := skycoinPrice.Service(skycoinPrices)

	server := trade.NewHTTPServer(*recaptchaSecret, *bindingFlag, storage, users, auth, log, geo, messages, mailer, &skycoinPricesInterface)
	skycoinPrices.StartUpdatingCycle()

	if err := server.Run(); err != nil {
		panic(err.Error())
	}
}
