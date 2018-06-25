package errors

import (
	"bytes"
	"strings"
)

// DbDuplicateEntry corresponds to an db error that specifies duplicating of data
const DbDuplicateEntry = "Error 1062: "
const duplicateEntryPropertyKey = "for key "

// ErrorType indicates which type has db error
type ErrorType int

// Available types for errors
const (
	GenericDatabaseError ErrorType = iota
	RegistrationDatabaseError
)

// IsDbValidationError checks if the error is db validation error
func IsDbValidationError(err error) bool {
	return strings.HasPrefix(err.Error(), DbDuplicateEntry)
}

// DatabaseErrorResponse parses database error string to user friendly error
func DatabaseErrorResponse(err error, errorType ErrorType) ValidationError {
	errorResponse := make([]ValidationErrorResponse, 0)

	if !IsDbValidationError(err) {
		return ValidationError{Errors: errorResponse}
	}

	if strings.HasPrefix(err.Error(), DbDuplicateEntry) {
		message := strings.TrimSuffix(err.Error(), DbDuplicateEntry)
		key := strings.Replace(strings.Split(message, duplicateEntryPropertyKey)[1], "'", "", -1)

		errorResponse = append(errorResponse, ValidationErrorResponse{
			Key:     makeFirstLowerCase(key),
			Message: getErrorMessage(errorType, key),
		})
	}

	return ValidationError{Errors: errorResponse}
}

// Gets error message by specified error type
func getErrorMessage(errorType ErrorType, key string) string {
	switch errorType {
	case RegistrationDatabaseError:
		return "An account with this " + strings.ToLower(key) + " has already been registered."
	default:
		return "Entity with this " + strings.ToLower(key) + " already exists in database."
	}
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
