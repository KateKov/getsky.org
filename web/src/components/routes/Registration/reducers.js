import {
    REGISTER_USER_RESPONSE_OK,
    SUCCESS_MESSAGE_CONFIRMED
} from './actions';

export const initialState = {
    successConfirmationVisible: false,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_USER_RESPONSE_OK:
            return {
                ...state,
                successConfirmationVisible: true,
            };
        case  SUCCESS_MESSAGE_CONFIRMED:
            return {
                ...state,
                successConfirmationVisible: false,
            };
        default:
            return state;
    }
};