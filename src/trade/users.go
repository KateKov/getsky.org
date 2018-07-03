package trade

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/skycoin/getsky.org/db/models"
	"github.com/skycoin/getsky.org/src/auth"
	ce "github.com/skycoin/getsky.org/src/errors"
	"github.com/skycoin/getsky.org/src/mail"
	"github.com/skycoin/getsky.org/src/util/httputil"

	validator "gopkg.in/go-playground/validator.v9"
)

// AuthenticateRequest holds auth data
type AuthenticateRequest struct {
	UserName string `json:"username"`
	Password string `json:"password"`
}

// AuthenticateResponse holds generated token response
type AuthenticateResponse struct {
	Token string `json:"token"`
}

// AuthenticateHandler handles user authentication
// Method: POST
// Accept: application/json
// URI: /api/users/authenticate
// Args:
//    {"username": "...", "password": "..."}
func AuthenticateHandler(s *HTTPServer) httputil.APIHandler {
	return func(w http.ResponseWriter, r *http.Request) error {

		w.Header().Set("Accept", "application/json")

		req := AuthenticateRequest{}
		decoder := json.NewDecoder(r.Body)
		if err := decoder.Decode(&req); err != nil {
			err = fmt.Errorf("Invalid json request body: %v", err)
			return httputil.StatusError{
				Err:  err,
				Code: http.StatusBadRequest,
			}
		}

		err := s.authenticator.VerifyPassword(req.UserName, req.Password)
		if err != nil {
			return httputil.StatusError{
				Err:  errors.New("Invalid username or password"),
				Code: http.StatusUnauthorized,
			}
		}

		u, e := s.users.Get(req.UserName)
		if e != nil {
			return err
		}

		token, err := auth.GetToken(*u)
		if err != nil {
			return err
		}

		resp := AuthenticateResponse{
			Token: token,
		}

		return json.NewEncoder(w).Encode(resp)
	}
}

// RegisterRequest holds auth data
type RegisterRequest struct {
	UserName   string `json:"userName" validate:"required"`
	Password   string `json:"password" validate:"required"`
	Email      string `json:"email" validate:"required,email"`
	TimeOffset int    `json:"timeOffset" validate:"min=-11,max=14"`
	Recaptcha  string `json:"recaptcha" validate:"required"`
}

// RegisterHandler handles user authentication
// Method: POST
// Accept: application/json
// URI: /api/users
func RegisterHandler(s *HTTPServer) httputil.APIHandler {
	return func(w http.ResponseWriter, r *http.Request) error {

		w.Header().Set("Accept", "application/json")

		req := RegisterRequest{}
		decoder := json.NewDecoder(r.Body)
		if err := decoder.Decode(&req); err != nil {
			err = fmt.Errorf("Invalid json request body: %v", err)
			return httputil.StatusError{
				Err:  err,
				Code: http.StatusBadRequest,
			}
		}

		err := s.validate.Struct(req)
		if err != nil {
			return ce.ValidatorErrorsResponse(err.(validator.ValidationErrors))
		}

		res, err := s.checkRecaptcha(req.Recaptcha)
		if err != nil {
			return err
		} else if !res {
			return ce.CreateSingleValidationError("recaptcha", "is not valid")
		}

		user := models.User{
			UserName:   req.UserName,
			Email:      req.Email,
			TimeOffset: req.TimeOffset,
		}

		err = s.users.Register(user, req.Password)
		if err != nil {
			if ce.IsDbValidationError(err) {
				return ce.DbErrorResponse{
					Err: "duplicate",
					Key: ce.FindDuplicateKey(err),
				}
			}

			return httputil.StatusError{
				Err:  err,
				Code: http.StatusInternalServerError,
			}

		}

		welcomeEmail :=
			fmt.Sprintf("Welcome to Buysky.org <br/><br/>"+
				"Please keep this email for your records. Your account information is as follows<br/>"+
				"---<br/>"+
				"Username: %s<br/>"+
				"---<br/><br/>"+
				"Thank you for registering.", req.UserName)
		err = s.mailer.SendMail(&mail.Letter{
			Body:    welcomeEmail,
			Subject: "Welcome to Buysky.org",
			To:      req.Email,
		})
		if err != nil {
			s.log.Errorln("users.RegisterHandler > s.mailer.SendMail > to:", req.Email, " ", err)
		}
		return nil
	}
}

// UpdateSettingsRequest holds userDetails properties that should be updated
type UpdateSettingsRequest struct {
	Email         string                `json:"email"`
	TimeOffset    int                   `json:"timeOffset"`
	CountryCode   models.JSONNullString `json:"countryCode"`
	StateCode     models.JSONNullString `json:"stateCode"`
	City          string                `json:"city"`
	PostalCode    string                `json:"postalCode"`
	DistanceUnits string                `json:"distanceUnits"`
	Currency      string                `json:"currency"`
}

// UpdateUserSettingsHandler updates user's settings
// Method: POST
// Accept: application/json
// URI: /api/me/settings
func UpdateUserSettingsHandler(s *HTTPServer) httputil.APIHandler {
	return func(w http.ResponseWriter, r *http.Request) error {
		w.Header().Set("Accept", "application/json")
		userName := r.Header.Get("name")

		req := UpdateSettingsRequest{}
		decoder := json.NewDecoder(r.Body)
		if err := decoder.Decode(&req); err != nil {
			return httputil.StatusError{
				Err:  fmt.Errorf("Invalid json request body: %v", err),
				Code: http.StatusBadRequest,
			}
		}

		err := s.validate.Struct(req)
		if err != nil {
			return ce.ValidatorErrorsResponse(err.(validator.ValidationErrors))
		}

		targetUser, err := s.users.Get(userName)
		if err != nil {
			http.Error(w, fmt.Sprintf("the user with the userName: '%s' doesn't exist", userName), http.StatusNotFound)
			return nil
		}

		userWithSameEmail, err := s.users.GetByEmail(req.Email)
		if err == nil && userWithSameEmail.UserName != targetUser.UserName {
			return ce.CreateSingleValidationError("email", "Specified email address is already used by another user")
		}

		userSettings := models.UserSettings{
			UserName:      userName,
			Email:         req.Email,
			TimeOffset:    req.TimeOffset,
			CountryCode:   req.CountryCode,
			StateCode:     req.StateCode,
			City:          req.City,
			PostalCode:    req.PostalCode,
			DistanceUnits: req.DistanceUnits,
			Currency:      req.Currency,
		}

		err = s.users.UpdateSettings(userSettings)
		return err
	}
}

// MeHandler returns currently logged in user info
// Method: GET
// Content-type: application/json
// URI: /api/me
func MeHandler(s *HTTPServer) httputil.APIHandler {
	return func(w http.ResponseWriter, r *http.Request) error {
		userName := r.Header.Get("name")

		userDetails, err := s.users.Get(userName)
		if err != nil {
			return err
		}

		return json.NewEncoder(w).Encode(userDetails)
	}
}

// ChangePasswordRequest represents a body of the change password request
type ChangePasswordRequest struct {
	OldPassword string `json:"oldPassword" validate:"required"`
	NewPassword string `json:"newPassword" validate:"required"`
}

// ChangePasswordHandler sets a new password to the specified user
// Method: POST
// Accept: application/json
// URI: /api/me/change-password
func ChangePasswordHandler(s *HTTPServer) httputil.APIHandler {
	return func(w http.ResponseWriter, r *http.Request) error {
		userName := r.Header.Get("name")
		body := &ChangePasswordRequest{}
		if err := json.NewDecoder(r.Body).Decode(body); err != nil {
			return httputil.StatusError{
				Err:  fmt.Errorf("Invalid json request body: %v", err),
				Code: http.StatusBadRequest,
			}
		}

		err := s.validate.Struct(body)
		if err != nil {
			return ce.ValidatorErrorsResponse(err.(validator.ValidationErrors))
		}

		err = s.authenticator.VerifyPassword(userName, body.OldPassword)
		if err != nil {
			return ce.CreateSingleValidationError("oldPassword", "Specified old password is invalid")
		}

		return s.authenticator.ChangePassword(userName, body.NewPassword)
	}
}

type resetPasswordRequest struct {
	Email     string `json:"email" validate:"required"`
	Recaptcha string `json:"recaptcha" validate:"required"`
}

// ResetPasswordRequestHandler generates a reset password code and sends it to the user's email
// Method: POST
// Accept: application/json
// URI: /api/reset-password-request
func ResetPasswordRequestHandler(s *HTTPServer) httputil.APIHandler {
	return func(w http.ResponseWriter, r *http.Request) error {
		body := &resetPasswordRequest{}
		if err := json.NewDecoder(r.Body).Decode(body); err != nil {
			return httputil.StatusError{
				Err:  fmt.Errorf("Invalid json request body: %v", err),
				Code: http.StatusBadRequest,
			}
		}

		err := s.validate.Struct(body)
		if err != nil {
			return ce.ValidatorErrorsResponse(err.(validator.ValidationErrors))
		}

		res, err := s.checkRecaptcha(body.Recaptcha)
		if err != nil {
			return err
		} else if !res {
			return ce.CreateSingleValidationError("recaptcha", "is not valid")
		}

		_, err = s.users.GetByEmail(body.Email)
		if err != nil {
			http.Error(w, fmt.Sprintf("the user with the email: '%s' doesn't exist", body.Email), http.StatusNotFound)
			return nil
		}

		code, err := s.authenticator.GenerateResetPasswordCode(body.Email)
		if err != nil {
			return err
		}

		var scheme string
		if r.URL.Scheme == "" {
			scheme = `http://`
		} else {
			scheme = r.URL.Scheme
		}
		linkHref := scheme + r.Host + `/password-recovery?code=` + code
		fmt.Println(linkHref)

		err = s.mailer.SendMail(&mail.Letter{
			To:      body.Email,
			Subject: "BuySky Password Recovery",
			Body:    `To set a new password please follow this <a href='` + linkHref + `'>link</a>`,
		})
		if err != nil {
			s.log.Errorln("users.ResetPasswordRequestHandler > s.mailer.SendMail > to:", body.Email, " ", err)
		}

		return err
	}
}

type resetPassword struct {
	Code        string `json:"code" validate:"required"`
	NewPassword string `json:"newPassword" validate:"required"`
}

// ResetPasswordHandler applies a new password for the user
// Method: POST
// Accept: application/json
// URI: /api/reset-password
func ResetPasswordHandler(s *HTTPServer) httputil.APIHandler {
	return func(w http.ResponseWriter, r *http.Request) error {
		body := &resetPassword{}
		if err := json.NewDecoder(r.Body).Decode(body); err != nil {
			return httputil.StatusError{
				Err:  fmt.Errorf("Invalid json request body: %v", err),
				Code: http.StatusBadRequest,
			}
		}

		err := s.validate.Struct(body)
		if err != nil {
			return ce.ValidatorErrorsResponse(err.(validator.ValidationErrors))
		}

		err = s.authenticator.ResetPasswordCode(body.Code, body.NewPassword)
		if err != nil {
			http.Error(w, fmt.Sprintf("wrong reset password code: '%s'", body.Code), http.StatusBadRequest)
			return nil
		}

		return nil
	}
}
