import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as api from '../../../api';
import * as apiStubs from '../../../__mocks__/api';

import * as actions from './actions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('search adverts actions', () => {
    it('should dispatch LOAD_SEARCH_ADVERTS action with adverts data', () => {
        const store = mockStore({});
        const stubDetails = { sellAdverts: [], buyAdverts: [] };
        const expectedActions = [
            { type: actions.LOAD_SEARCH_ADVERTS },
            { type: actions.SEARCH_ADVERTS_SUCCESS, allAdverts: { ...stubDetails } }
        ];

        api.searchAllAdverts = apiStubs.searchAllAdverts;
        return store.dispatch(actions.searchAdverts())
            .then(() => expect(store.getActions()).toEqual(expectedActions));
    });

    it('should dispatch SEARCH_ADVERTS_FAILED action', () => {
        const store = mockStore({});
        const expectedActions = [
            { type: actions.LOAD_SEARCH_ADVERTS },
            { type: actions.SEARCH_ADVERTS_FAILED, error: 'error' }
        ];

        api.searchAllAdverts = apiStubs.searchAllAdvertsFail;
        return store.dispatch(actions.searchAdverts())
            .then(() => expect(store.getActions()).toEqual(expectedActions));
    });


    it('should dispatch SET_FILTERS action', () => {
        const store = mockStore({});
        const stubDetails = { countryCode: 'US' };
        const expectedActions = [
            { type: actions.SET_FILTERS, filters: { ...stubDetails } },
        ];

        return store.dispatch(actions.setFilters(stubDetails))
            .then(() => expect(store.getActions()).toEqual(expectedActions));
    });

    it('should dispatch CLEAR_FILTERS action', () => {
        const store = mockStore({});
        const expectedActions = [
            { type: actions.CLEAR_FILTERS },
        ];

        return store.dispatch(actions.clearFilters())
            .then(() => expect(store.getActions()).toEqual(expectedActions));
    });
});