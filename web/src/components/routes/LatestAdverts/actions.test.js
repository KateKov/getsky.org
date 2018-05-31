import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as api from '../../../api';
import * as apiStubs from '../../../__mocks__/api';

import * as actions from './actions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('latest advert actions', () => {
    describe('getLatestAdverts', () => {
        it('should dispatch LOAD_ADVERTS action with advert data', () => {
            const store = mockStore({});
            const stubDetails = { sellAdverts: [], buyAdverts: [] };
            const expectedActions = [
                { type: actions.LOAD_ADVERTS },
                { type: actions.LOAD_ADVERTS_SUCCESS, allAdverts: {...stubDetails} }
            ];

            api.getAllAdverts = apiStubs.getAllAdverts;
            return store.dispatch(actions.getAdverts())
                .then(() => expect(store.getActions()).toEqual(expectedActions));
        });

        it('should dispatch LOAD_ADVERTS_FAILED action with notFound error status', () => {
            const store = mockStore({});
            const expectedActions = [
                { type: actions.LOAD_ADVERTS },
                { type: actions.LOAD_ADVERTS_FAILED, error: 'error' }
            ];

            api.getAllAdverts = apiStubs.getAllAdverts404;
            return store.dispatch(actions.getAdverts())
                .then(() => expect(store.getActions()).toEqual(expectedActions));
        });
    });
});
