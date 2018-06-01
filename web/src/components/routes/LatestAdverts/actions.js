import get from 'lodash/get';
import { getAllAdverts } from '../../../api';

export const LOAD_ADVERTS = 'LOAD_ADVERTS';
export const LOAD_ADVERTS_SUCCESS = 'LOAD_ADVERTS_SUCCESS';
export const LOAD_ADVERTS_FAILED = 'LOAD_ADVERTS_FAILED';

export const getAdverts = () => async (dispatch) => {
    dispatch({ type: LOAD_ADVERTS });
    try {
        const allAdverts = await getAllAdverts();
        dispatch({ type: LOAD_ADVERTS_SUCCESS, allAdverts });
    } catch (error) {
        const errorMessage = get(error, 'response.data', 'error');
        dispatch({ type: LOAD_ADVERTS_FAILED, error: errorMessage });
    }
};
