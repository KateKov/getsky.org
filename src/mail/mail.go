package mail

import (
	"fmt"

	"github.com/sirupsen/logrus"
)

const mime = "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"

// Letter represents an email latter
type Letter struct {
	To      string
	Subject string
	Body    string
}

// Mailer represents a mail sender
type Mailer interface {
	SendMail(l *Letter) error
	SendFeedback(l *Letter) error
}

// MailerInfo represents a mail sender
type MailerInfo struct {
	host     string
	username string
	password string
	from     string

	feedbackAddress string

	log logrus.FieldLogger
}

func getBody(l *Letter, from string) []byte {
	body := fmt.Sprintf("To: %s\r\n"+
		"From: %s\r\n"+
		"Subject: %s\r\n"+
		mime+"\r\n"+
		"\r\n"+
		"%s\r\n", l.To, from, l.Subject, l.Body)
	return []byte(body)
}
