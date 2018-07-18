import { push } from 'react-router-redux'

import { registerUser } from '../../../api';

export const REGISTER_USER_REQUEST = 'REGISTER_USER_REQUEST';
export const REGISTER_USER_RESPONSE_OK = 'REGISTER_USER_RESPONSE_OK';
export const REGISTER_USER_RESPONSE_ERROR = 'REGISTER_USER_RESPONSE_ERROR';

export const register = (user) =>
    async dispatch => {
        dispatch({ type: REGISTER_USER_REQUEST });
        try {
            await registerUser(user);
            dispatch({ type: REGISTER_USER_RESPONSE_OK });
        }
        catch (e) {
            const errors = e.response.data;
            switch (e.response.status) {
                case 400:
                    dispatch({ type: REGISTER_USER_RESPONSE_ERROR });
                    const formErrors = {};
                    Object.values(errors).map(k => formErrors[k.key] = k.message)
                    return Promise.reject(formErrors);
                case 409:
                    dispatch({ type: REGISTER_USER_RESPONSE_ERROR });
                    return Promise.reject(errors);
                default:
            }
        }
    };

export const goToLoginPage = () => async dispatch => {
    dispatch(push('/login'));
}
