import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as api from 'api/';
import * as apiStubs from '__mocks__/api';

import * as actions from './actions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('app initializer actions', () => {
    describe('requestSkycoinPrice', () => {
        it('should dispatch SKYCOIN_PRICE_RESPONSE action with received price', () => {
            const price = 1;
            const currency = 'EUR';
            const expectedActions = [
                { type: actions.SKYCOIN_PRICE_REQUEST },
                { type: actions.SKYCOIN_PRICE_RESPONSE, prices:[{ code: "EUR", price: "19.4068220127" }, { code: "UAH", price: "601.275954735" }, { code: "USD", price: "22.9115" }] }
            ];

            api.getSkycoinPrice = apiStubs.getSkycoinPriceOk(price);
            const res = actions.requestSkycoinPrice(currency);

            const store = mockStore({});
            return store.dispatch(actions.requestSkycoinPrice(currency))
                .then(() => expect(store.getActions()).toEqual(expectedActions));
        });
    });
});
