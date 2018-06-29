import get from 'lodash/get';
import { searchAllAdverts } from '../../../api';

export const LOAD_SEARCH_ADVERTS = 'LOAD_SEARCH_ADVERTS';
export const SEARCH_ADVERTS_SUCCESS = 'SEARCH_ADVERTS_RESPONSE';
export const SEARCH_ADVERTS_FAILED = 'SEARCH_ADVERTS_FAILED';

export const searchAdverts = query => async (dispatch) => {
    dispatch({ type: LOAD_SEARCH_ADVERTS });

    try {
        const allAdverts = await searchAllAdverts(query);
        dispatch({ type: SEARCH_ADVERTS_SUCCESS, allAdverts });
    } catch (err) {
        const error = get(err, 'response.data', 'error');
        dispatch({ type: SEARCH_ADVERTS_FAILED, error });
    }
};


export const SET_FILTERS = 'SET_FILTERS';
export const setFilters = filters => async dispatch => {
    dispatch({ type: SET_FILTERS, filters });
};

export const CLEAR_FILTERS = 'CLEAR_FILTERS';
export const clearFilters = () => async dispatch => {
    dispatch({ type: CLEAR_FILTERS });
};
