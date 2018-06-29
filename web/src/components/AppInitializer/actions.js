import { getAuthTokens } from '../../storage'
import { loginUserResponseOk } from '../routes/Login/actions';
import {
    getCountries as getCountriesRequest,
    getStates as getStatesRequest,
    getUserInfo as getUserInfoApi,
    getSkycoinPrice as getSkycoinPriceApi,
} from '../../api';

export const initApp = () =>
    async dispatch => {
        const authTokens = getAuthTokens();

        if (authTokens !== null) {
            dispatch(loginUserResponseOk());
        }
    }

export const GET_COUNTRIES_RESPONSE = 'GET_COUNTRIES_RESPONSE';

export const getCountries = () =>
    async dispatch => {
        try {
            const countries = await getCountriesRequest().catch(e => { });

            dispatch({
                type: GET_COUNTRIES_RESPONSE,
                countries: countries.data,
            });
        } catch (e) {
            console.log(e.message);
        }
    };

export const GET_STATES_RESPONSE = 'GET_STATES_RESPONSE';

export const getStates = () =>
    async dispatch => {
        const states = await getStatesRequest();

        dispatch({
            type: GET_STATES_RESPONSE,
            states: states.data,
        });
    };

export const GET_USER_INFO_RESPONSE = 'GET_USER_INFO_RESPONSE';
export const getUserInfo = () => async dispatch => {
    try {
        const response = await getUserInfoApi();
        dispatch({ type: GET_USER_INFO_RESPONSE, userInfo: response.data });
    } catch (e) {
        console.log(e.message);
    }
};

export const SKYCOIN_PRICE_REQUEST = 'SKYCOIN_PRICE_REQUEST';
export const SKYCOIN_PRICE_RESPONSE = 'SKYCOIN_PRICE_RESPONSE';

export const requestSkycoinPrice = () =>
    async dispatch => {
        try {
            dispatch({ type: SKYCOIN_PRICE_REQUEST });

            const response = await getSkycoinPriceApi();
            dispatch({ type: SKYCOIN_PRICE_RESPONSE, prices: response.data });
        } catch (e) {
            console.log(e.message);
        }
    };

export const CHANGE_SELECTED_CURRENCY = 'CHANGE_SELECTED_CURRENCY';
export const changeSelectedCurrency = currency => ({ type: CHANGE_SELECTED_CURRENCY, currency });
