package mail

import (
	"net/smtp"

	"github.com/sirupsen/logrus"
)

// PostfixMailer is a mail service that allows to send emails to postfix service
type PostfixMailer struct {
	MailerInfo
}

// NewPostfixMailer creates a new instance of the Mailer
func NewPostfixMailer(host string, username string, password string, feedbackAddress string, from string, log logrus.FieldLogger) PostfixMailer {
	return PostfixMailer{
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
func (m PostfixMailer) SendFeedback(l *Letter) error {
	l.To = m.feedbackAddress
	return m.SendMail(l)
}

// SendMail sends a letter
func (m PostfixMailer) SendMail(l *Letter) error {
	msg := getBody(l, m.from)

	client, err := smtp.Dial(m.host)
	if err != nil {
		m.log.Errorln("PostfixMailer.SendMail > (smtp.Dial): ", m.host, "\n", err)
		return nil
	}
	// Avoid failing build because of error check
	defer func() {
		if err := client.Close(); err != nil {
			return
		}
	}()

	if err = client.Mail(m.from); err != nil {
		m.log.Errorln("PostfixMailer.SendMail > (client.Mail): ", m.from, "\n", err)
		return err
	}

	if err = client.Rcpt(l.To); err != nil {
		m.log.Errorln("PostfixMailer.SendMail > (client.Rcpt): ", l.To, "\n", err)
		return err
	}

	w, err := client.Data()
	if err != nil {
		m.log.Errorln("PostfixMailer.SendMail > (client.Data): ", "\n", err)
		return err
	}

	_, err = w.Write(msg)
	if err != nil {
		m.log.Errorln("PostfixMailer.SendMail > (w.Write): ", "\n", err)
		return err
	}

	err = w.Close()
	if err != nil {
		m.log.Errorln("PostfixMailer.SendMail > (w.Close): ", "\n", err)
		return err
	}

	err = client.Quit()
	if err != nil {
		m.log.Errorln("PostfixMailer.SendMail > (client.Quit): ", "\n", err)
	}
	return err
}
