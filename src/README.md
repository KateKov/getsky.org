# Back-End development

## Auto reloading the api server
Use [gin](https://github.com/codegangsta/gin) to auto build and reload API server on any file change

```sh
$ go get github.com/codegangsta/gin
$ cd cmd/trade/ && gin --immediate --appPort 8081 --path ../../src/trade --build ./ run trade.go
``` 

Then access API at `localhost:3000/api` where 3000 is default gin proxy port

## Postfix configuration 

### Installation
1. Install postfix service
	```sudo apt-get install postfix```

2. Install mailutils
	```sudo apt-get install mailutils```

3. Edit postfix main.cf 
	```vi /etc/postfix/main.cf```
	``` # TLS parameters
	smtpd_use_tls=yes
	smtpd_tls_session_cache_database = btree:${data_directory}/smtpd_scache
	smtp_tls_session_cache_database = btree:${data_directory}/smtp_scache
	smtp_tls_note_starttls_offer = yes
	smtp_tls_policy_maps = hash:/etc/postfix/tls_policy
	
	# Relay host configuration
	relayhost = smtp.gmail.com:587
	
	# SASL Configuration
	smtp_sasl_auth_enable = yes
	smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
	smtp_sasl_security_options = noanonymous
	smtp_sasl_mechanism_filter = plain
	smtp_sasl_tls_security_options = noanonymous

	# Other settings
	mail_owner = _postfix
	setgid_group = _postdrop
	# mydomain_fallback = localhost
	```

4. Add relay user to send the mail
	``` vi /etc/postfix/sasl_passwd ```
 	``` smtp.gmail.com:587 user@gmail.com:Password```
	``` postmap /etc/postfix/sasl_passwd ```

5. Config to force the use of ssl with the gmail smtp server
	``` vi /etc/postfix/tls_policy ```
 	``` smtp.gmail.com:587 encrypt```
	``` postmap /etc/postfix/tls_policy ```

6. Run or reload postfix
	```sudo postfix reload``` - reload postfix
	```sudo postfix start``` - reload start

7. Test emailing
	```echo "Test sending email from Postfix" | mail -s "Test Postfix" youremail@domain.com```

### Tips
- Check logs: ```cat /var/log/mail.log```
- Delete all messages from queue: ```postsuper -d ALL```
- Check queue with mails: ```mailq```
