package errors

import (
	"bytes"
	"regexp"
	"strings"
)

// DbErrorResponse is entity that contains error name and its key name
type DbErrorResponse struct {
	Err string `json:"error"`
	Key string `json:"field"`
}

// DuplicateRegex is regex for searching the key name
const DuplicateRegex = `for key '([a-zA-Z]+)'`

// DbDuplicateEntry corresponds to an db error that specifies duplicating of data
const DbDuplicateEntry = "Error 1062: "

func (e DbErrorResponse) Error() string {
	return e.Err
}

// IsDbValidationError checks if the error is db validation error
func IsDbValidationError(err error) bool {
	return strings.HasPrefix(err.Error(), DbDuplicateEntry)
}

// FindDuplicateKey finds the duplicate key
func FindDuplicateKey(err error) string {
	re := regexp.MustCompile(DuplicateRegex)
	groups := re.FindStringSubmatch(err.Error())
	if len(groups) >= 1 {
		return makeFirstLowerCase(groups[1])
	}

	return ""
}

func makeFirstLowerCase(s string) string {
	if len(s) < 2 {
		return strings.ToLower(s)
	}

	bts := []byte(s)

	lc := bytes.ToLower([]byte{bts[0]})
	rest := bts[1:]

	return string(bytes.Join([][]byte{lc, rest}, nil))
}
