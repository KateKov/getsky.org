package errors

import (
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
