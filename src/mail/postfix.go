package mail

import (
	"net/smtp"
)

// PostfixMailer is a mail service that allows to send emails to postfix service
type PostfixMailer struct {
	MailerInfo
}

// NewPostfixMailer creates a new instance of the Mailer
func NewPostfixMailer(host string, username string, password string, feedbackAddress string, from string) PostfixMailer {
	return PostfixMailer{
		MailerInfo: MailerInfo{
			host:            host,
			from:            from,
			username:        username,
			password:        password,
			feedbackAddress: feedbackAddress,
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
		return nil
	}
	// Avoid failing build because of error check
	defer func() {
		if err := client.Close(); err != nil {
			return
		}
	}()

	if err = client.Mail(m.from); err != nil {
		return err
	}

	if err = client.Rcpt(l.To); err != nil {
		return err
	}

	w, err := client.Data()
	if err != nil {
		return err
	}

	_, err = w.Write(msg)
	if err != nil {
		return err
	}

	err = w.Close()
	if err != nil {
		return err
	}

	return client.Quit()
}
