import {
    GET_COUNTRIES_RESPONSE,
    GET_STATES_RESPONSE,
    GET_USER_INFO_RESPONSE,
    SKYCOIN_PRICE_RESPONSE,
} from './actions';

import { LOGOUT_USER } from 'components/routes/Login/actions';

export const initialState = {
    countries: [],
    states: [],
    userInfo: null,
    skyPrices: {},
};

const saveSkycoinPrices = (prices) => {
    const mutation = {};
    prices.forEach(v => {
        mutation[v.code] = v.price;
    })

    return mutation;
}

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_COUNTRIES_RESPONSE:
            return { ...state, countries: action.countries.map(c => ({ text: c.name, value: c.code })) };
        case GET_STATES_RESPONSE:
            return { ...state, states: action.states.map(s => ({ text: s.name, value: s.code })) };
        case GET_USER_INFO_RESPONSE:
            return { ...state, userInfo: action.userInfo };
        case SKYCOIN_PRICE_RESPONSE:
            return { ...state, skyPrices: saveSkycoinPrices(action.prices) };
        case LOGOUT_USER:
            return { ...state, userInfo: null };
        default:
            return state;
    }
};
