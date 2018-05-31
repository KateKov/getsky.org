import { LOAD_ADVERTS, LOAD_ADVERTS_SUCCESS, LOAD_ADVERTS_FAILED } from './actions';
import reduce, { initialState } from './reducers';
import * as actions from './actions';

describe('advert reducer', () => {
    describe('LOAD_ADVERTS', () => {
        it('should clear state of reducer', () => {
            expect(reduce(initialState, { type: actions.LOAD_ADVERTS }))
                .toEqual(initialState);
        });
    });

    describe('LOAD_ADVERTS_SUCCESS', () => {
        it('should store details entity from action to the reducer\'s state', () => {
            const advertsStateStub = { buyAdverts: [], sellAdverts: [] };;
            const expectedState = { ...initialState, ...advertsStateStub, loading: false };
            expect(reduce(initialState, { type: actions.LOAD_ADVERTS_SUCCESS, details: advertsStateStub }))
                .toEqual(expectedState);
        });
    });

    describe('LOAD_ADVERTS_FAILED', () => {
        it('should store details entity from action to the reducer\'s state', () => {
            const advertsStateStub = { error: 'error' };;
            const expectedState = { ...initialState, ...advertsStateStub, loading: false };
            expect(reduce(initialState, { type: actions.LOAD_ADVERTS_FAILED, ...advertsStateStub }))
                .toEqual(expectedState);
        });
    });
});
