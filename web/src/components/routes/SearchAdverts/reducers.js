import {
    LOAD_SEARCH_ADVERTS,
    SEARCH_ADVERTS_SUCCESS,
    SEARCH_ADVERTS_FAILED,
    SET_FILTERS,
    CLEAR_FILTERS
} from './actions';

export const initialState = {
    loading: true,
    buyAdverts: [],
    sellAdverts: [],
    filters: {},
    error: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SEARCH_ADVERTS:
            return {
                ...state,
                loading: true,
            };
        case SEARCH_ADVERTS_SUCCESS:
            return {
                ...state,
                ...action.allAdverts,
                loading: false,
            };
        case SEARCH_ADVERTS_FAILED:
            return {
                ...state,
                error: action.error,
                loading: false,
            };
        case SET_FILTERS:
            return {
                ...state,
                filters: action.filters,
            };
        case CLEAR_FILTERS:
            return {
                ...state,
                filters: {},
            };
        default:
            return state;
    }
};
