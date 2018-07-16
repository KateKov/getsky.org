import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as api from '../../../api';
import * as apiStubs from '../../../__mocks__/api';

import * as actions from './actions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('reset pasword actions', () => {
    it('should dispatch RESET_PASSWORD_SUCCESS action', () => {
        const store = mockStore({});
        const recaptcha = 'testRecaptcha';
        const stubDetails = { email: 'test@gmail.com', recaptcha };
        const expectedActions = [
            { type: actions.RESET_PASSWORD_REQUEST },
            { type: '@@redux-form/DESTROY', meta: { form: ['forgotPasswordForm'] } },
            { type: actions.RESET_PASSWORD_SUCCESS },
        ];

        api.resetPasswordRequest = apiStubs.resetPasswordRequestOk(stubDetails);
        return store.dispatch(actions.resetPassword())
            .then(() => expect(store.getActions()).toEqual(expectedActions));
    });
    it('should dispatch RESET_PASSWORD_FAILED action', () => {
        const store = mockStore({});
        const recaptcha = 'testRecaptcha';
        const stubDetails = { email: 'test@gmail.com', recaptcha };
        const expectedActions = [
            { type: actions.RESET_PASSWORD_REQUEST },
            { type: actions.RESET_PASSWORD_FAILED },
        ];

        api.resetPasswordRequest = apiStubs.resetPasswordRequest404(stubDetails);
        return store.dispatch(actions.resetPassword())
            .catch((e) => expect(store.getActions()).toEqual(expectedActions));
    });
});

describe('reset pasword actions', () => {
    it('should dispatch RECOVER_PASSWORD_SUCCESS action', () => {
        const store = mockStore({});
        const stubDetails = { newPassword: 'testpasword', code: '?testString' };
        const expectedActions = [
            { type: actions.RECOVER_PASSWORD_REQUEST },
            { type: actions.RECOVER_PASSWORD_SUCCESS },
        ];

        api.recoverPassword = apiStubs.saveNewPasswordOk(stubDetails);
        return store.dispatch(actions.saveNewPassword(stubDetails.newPassword, stubDetails.code))
            .then(() => expect(store.getActions()).toEqual(expectedActions));
    });

    it('should dispatch RECOVER_PASSWORD_FAILED action', () => {
        const store = mockStore({});
        const expectedActions = [
            { type: actions.RECOVER_PASSWORD_REQUEST },
            { type: actions.RECOVER_PASSWORD_FAILED },
        ];

        api.recoverPassword = apiStubs.saveNewPasswordFail();
        return store.dispatch(actions.saveNewPassword())
            .then(() => expect(store.getActions()).toEqual(expectedActions));
    });
});
