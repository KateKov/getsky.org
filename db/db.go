package db

import (
	"fmt"

	"github.com/jmoiron/sqlx"
)

// InitDb initialize connection to mysql database using sqlx
func InitDb(addr string) (*sqlx.DB, error) {
	db, err := sqlx.Connect("mysql", fmt.Sprintf("%s/getskytrade?parseTime=true", addr))
	if err != nil {
		return nil, err
	}

	return db, nil
}
