# BuySKY

[![Build Status](https://travis-ci.org/skycoin/getsky.org.svg?branch=master)](https://travis-ci.org/skycoin/getsky.org)

An online Skycoin advert platform, part of the [getsky.org](http://getsky.org)

# Installation
## Manual installation
### Required software
1. Nginx
1. Go
1. MySql

### DB configuration
1. Create database `getskytrade`
1. Follow the [instructions](./db/README.md) to apply migrations.

### Backend configuration
1. Run backend using following command 
```sh 
$ go run ./trade.go -binding=127.0.0.1:8081 -mysql=localhost:3306 -recaptchaSecret=RECAPTCHA_SECRET -mailUsername=MAIL_USERNAME -mailPassword=MAIL_PASSWORD -mailHost=MAIL_HOST
```

### Client app configuration
1. Copy content of the `repo_root/.nginx/nginx.conf` file to the `/etc/nginx/nginx.conf`
1. Create `/etc/nginx/vhost.d` folder
1. Create `proxy.conf` in the `/etc/nginx/vhost.d` folder
1. Copy content of the `repo_root/.nginx/vhost.d/proxy.conf` file to the `/etc/nginx/vhost.d/proxy.conf`
1. Find the line `proxy_pass        http://backend:8081` and change it to `proxy_pass        http://127.0.0.1:8081`
1. Run `systemctl restart nginx`
1. Copy built client to the `/usr/share/nginx/html` folder ([Instructions on how to build the client app](./web/README.md))

## Deployment via docker
### Required software
1. Docker
1. Nodejs
1. Yarn

### Deployment
To set up the system run following commands:
```sh
$ make run-docker
$ docker exec backend sh -c "cd /usr/local/go/src/github.com/skycoin/getsky.org/db/ && bash ./migrate.sh"
```

## SSL configuration
1. Follow [these instructions](https://certbot.eff.org/lets-encrypt/ubuntuxenial-other) to install certbot;
2. Stop docker containers using following command `docker kill $(docker ps -q)` (optional, only if docker-compose is used)
3. Run certbot: ``` sudo certbot certonly --webroot -w repo_root/.nginx/certs -d domain.name --register-unsafely-without-email -n --agree-tos ```
4. Copy issued certificates to the `repo_root/.nginx/certs` directory (fullchain.pem and privkey.pem)
5. Start docker containers: ` docker start $(docker ps -aq) `

**Please note:** `./.nginx/vhost.d/proxy.test.conf` and `./.nginx/vhost.d/cert.test.conf` Nginx configuration files must be used instead of proxy.conf for manual installation to support SSL. Also, the path to the certificates issued by certbot must be specified in the proxy.test.conf configuration file.

## Client app development
Information about client app development is available [here](./web/README.md)

## Health Check API
URL: /api/status

Response:
```
{"dbStatus":"OK","coinMarketCapStatus":"OK","marketCapLastUpdatedAt":"2018-07-19T07:58:42Z"}
```

Error response:
```
{"dbStatus":"error_text","coinMarketCapStatus":"OK","marketCapLastUpdatedAt":"2018-07-19T07:58:42Z"}
```

## Version management:
Version of the application is set in the `VERSION.env` file. Script in the `./cmd/update-versions/update-versions.go` updates versions of the backend and client applications based information, provided in the `VERSION.env` file.
