import {
    LOAD_SEARCH_ADVERTS,
    SEARCH_ADVERTS_SUCCESS,
    SEARCH_ADVERTS_FAILED,
    SET_FILTERS,
    CLEAR_FILTERS
} from './actions';
import reducer, { initialState } from './reducers';
import * as actions from './actions';

describe('search adverts reducer', () => {
    describe('LOAD_SEARCH_ADVERTS', () => {
        it('should clear state of reducer', () => {
            expect(reducer(undefined, { type: actions.LOAD_SEARCH_ADVERTS }))
                .toEqual(initialState);
        });
    });

    describe('LOAD_ADVERTS_SUCCESS', () => {
        it('should store details entity from action to the reducer\'s state', () => {
            const advertsStateStub = { buyAdverts: [], sellAdverts: [] };;
            const expectedState = { ...initialState, ...advertsStateStub, loading: true };
            expect(reducer(initialState, { type: actions.LOAD_ADVERTS_SUCCESS, allAdverts: advertsStateStub }))
                .toEqual(expectedState);
        });
    });

    describe('LOAD_ADVERTS_FAILED', () => {
        it('should store details entity from action to the reducer\'s state', () => {
            const advertsStateStub = { error: 'error' };
            const expectedState = { ...initialState, ...advertsStateStub, loading: false };
            expect(reducer(initialState, { type: actions.SEARCH_ADVERTS_FAILED, ...advertsStateStub }))
                .toEqual(expectedState);
        });
    });

    describe('SET_FILTERS', () => {
        it('should store details entity from action to the reducer\'s state', () => {
            const stubDetails = { countryCode: 'US' };
            const expectedState = { ...initialState, filters: stubDetails, loading: true };
            expect(reducer(initialState, { type: actions.SET_FILTERS, filters: stubDetails }))
                .toEqual(expectedState);
        });
    });

    describe('CLEAR_FILTERS', () => {
        it('must clear filter in store', () => {
            const stubDetails = {
                loading: true,
                buyAdverts: [{ id: 1 }],
                sellAdverts: [{ id: 2 }],
                filters: { countryCode: 'US' },
                error: null,
            };
            const expectedState = { ...stubDetails, filters: {} };
            expect(reducer(stubDetails, { type: actions.CLEAR_FILTERS }))
                .toEqual(expectedState);
        });
    });
});
