import get from 'lodash/get';
import { LOAD_ADVERTS, LOAD_ADVERTS_SUCCESS, LOAD_ADVERTS_FAILED } from './actions';

export const initialState = {
    loading: true,
    buyAdverts: [],
    sellAdverts: [],
    error: '',
};

export default (state = initialState, action) => {
    switch (action.type) {
        case LOAD_ADVERTS:
            return initialState;

        case LOAD_ADVERTS_SUCCESS:
            return {
                ...state,
                ...action.allAdverts,
                loading: false,
            };

        case LOAD_ADVERTS_FAILED:
        const error = get(action, 'error.response.data', 'error');
            return {
                ...state,
                loading: false,
                error,
            };

        default:
            return state;
    }
};
