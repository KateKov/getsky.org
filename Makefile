.DEFAULT_GOAL := help
.PHONY: trade test-api lint check db-schema stop-docker build-web run-web run-mysql run-docker help run-test-docker build-currency-feed build-backend

build-web: ## Restores packages and builds web app
	cd web; yarn install
	cd web; npm run build

build-backend: ## Builds backend app
	go build ./cmd/trade/trade.go

build-currency-feed: ## Builds app that pulls currency rates
	go build cmd/currencies/currencies.go

build: build-web build-backend ## Builds whole app

prepare-package: ## Copies all artifacts to the package folder
	rm -rf ./package 
	mkdir ./package
	mkdir ./package/backend
	mkdir ./package/client
	mkdir ./package/migrations
	cp -r ./web/build/** ./package/client
	cp ./trade ./package/backend
	cp ./cmd/trade/example.conf ./package/backend/default.conf
	cp -r ./db/schema/** ./package/migrations

check-version: ## Check if $VERSION env variable has value
ifeq ($(VERSION),)
	echo "VERSION env variable must be set"; 
	exit -1;
endif

zip-package: ## Creates archives with build artifacts
	cd ./package/backend; tar -zcvf ../backend-${VERSION}.tar.gz ./**; cd ../client; tar -zcvf ../client-${VERSION}.tar.gz ./**; cd ../migrations; tar -zcvf ../migrations-${VERSION}.tar.gz ./**
	rm -rf ./package/backend
	rm -rf ./package/client
	rm -rf ./package/migrations

package: check-version build prepare-package zip-package ## Builds and packages all artifacts

run-web: ## Runs web app locally
	cd web; npm start

stop-docker: ## Stops all docker containers
	docker-compose kill

docker-up: ## Starts docker containers
	docker-compose up -d

docker-test-up: ## Starts docker containers with test server configuration
	docker-compose -f docker-compose.yml -f docker-compose.test.yml up -d

run-docker: build-web docker-up ## Run all containers

run-test-docker: build-web build-currency-feed docker-test-up ## Run all containers with test server configuration

trade: ## Run trade back-end. To add arguments, do 'make ARGS="--foo" trade'.
	go run cmd/trade/trade.go ${ARGS}&

db-schema: ## migrates DB schema to latest version, run docker-up or run-local first
	cd db; sh migrate.sh

run-mysql: ## Run mysql in docker
	docker-compose up -d mysql

run-local: run-mysql db-schema trade ## Start DB and apply schema changes, run API

test-api: ## Run back-end tests
	go test ./src/... -timeout=1m -cover -v 

test-web: ## Run UI tests
	cd web; yarn install
	cd web; CI=true yarn test

lint: ## Run linters. Use make install-linters first.
	vendorcheck ./...
	gometalinter --deadline=3m -j 2 --disable-all --tests --vendor \
		-E deadcode \
		-E errcheck \
		-E gosec \
		-E goconst \
		-E gofmt \
		-E goimports \
		-E golint \
		-E ineffassign \
		-E interfacer \
		-E maligned \
		-E megacheck \
		-E misspell \
		-E nakedret \
		-E structcheck \
		-E unconvert \
		-E unparam \
		-E varcheck \
		-E vet \
		./...

check: lint test-api test-web ## Run tests and linters

install-linters: ## Install linters
	go get -u github.com/FiloSottile/vendorcheck
	go get -u github.com/alecthomas/gometalinter
	gometalinter --vendored-linters --install

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
