package mail

import (
	"net/smtp"
	"net/url"

	"github.com/sirupsen/logrus"
)

// GmailMailer is a mail service that allows to send emails to gmail service
type GmailMailer struct {
	MailerInfo
}

// NewGmailMailer creates a new instance of the Mailer
func NewGmailMailer(host string, username string, password string, feedbackAddress string, from string, log logrus.FieldLogger) GmailMailer {
	return GmailMailer{
		MailerInfo: MailerInfo{
			host:            host,
			from:            from,
			username:        username,
			password:        password,
			feedbackAddress: feedbackAddress,
			log:             log,
		},
	}
}

// SendFeedback sends mail to the feedback address
func (m GmailMailer) SendFeedback(l *Letter) error {
	l.To = m.feedbackAddress
	return m.SendMail(l)
}

// SendMail sends a letter
func (m GmailMailer) SendMail(l *Letter) error {
	host, err := url.Parse("//" + m.host)
	if err != nil {
		m.log.Errorln("GmailMailer.SendMail > (url.Parse): ", m.host, "\n", err)
		return err
	}

	auth := smtp.PlainAuth("", m.username, m.password, host.Hostname())

	to := []string{l.To}
	msg := getBody(l, m.from)

	err = smtp.SendMail(m.host, auth, m.from, to, msg)
	if err != nil {
		m.log.Errorln("GmailMailer.SendMail > (smtp.SendMail): ", m.host, " ", m.username, " ", m.from, " ", to, " ", "\n", err)
	}
	return err
}
