import get from 'lodash/get';
import { resetPasswordRequest, recoverPassword } from 'api/index';

export const RESET_PASSWORD_REQUEST = 'RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_FAILED = 'RESET_PASSWORD_FAILED';
export const resetPassword = (email, recaptcha) => async dispatch => {
    dispatch({ type: RESET_PASSWORD_REQUEST });
    try {
        await resetPasswordRequest({ email, recaptcha });
        dispatch({ type: RESET_PASSWORD_SUCCESS });
    } catch (e) {
        dispatch({ type: RESET_PASSWORD_FAILED });
    }
};

export const RECOVER_PASSWORD_REQUEST = 'RECOVER_PASSWORD';
export const RECOVER_PASSWORD_SUCCESS = 'RECOVER_PASSWORD_SUCCESS';
export const RECOVER_PASSWORD_FAILED = 'RECOVER_PASSWORD_FAILED';
export const saveNewPassword = (newPassword, code) => async dispatch => {
    dispatch({ type: RECOVER_PASSWORD_REQUEST });
    try {
        await recoverPassword({ newPassword, code });
        dispatch({ type: RECOVER_PASSWORD_SUCCESS });
    } catch (e) {
        dispatch({ type: RECOVER_PASSWORD_FAILED });
    }
  
};
