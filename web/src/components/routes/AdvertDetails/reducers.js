import { LOCATION_CHANGE } from 'react-router-redux'

import {
    GET_ADVERT_DETAILS_REQUEST,
    GET_ADVERT_DETAILS_RESPONSE,
} from './actions';

export const initialState = {};

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_ADVERT_DETAILS_REQUEST:
            return { ...state, loading: true, };
        case GET_ADVERT_DETAILS_RESPONSE:
            return { ...state, ...action.details, loading: false, };
        case LOCATION_CHANGE:
            return initialState;
        default:
            return state;
    }
};
