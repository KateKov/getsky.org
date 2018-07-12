import { push } from 'react-router-redux';
import { postBuyAdvert, postSellAdvert } from 'api/';
import { SellFormName, BuyFormName } from 'constants/index'
import { FORM_PREVIEW_CLEARED } from '../PostAdvert/actions';
export const SET_FORM_PREVIEW = 'SET_FORM_PREVIEW ';
export const CLEAR_FORM_PREVIEW = 'CLEAR_FORM_PREVIEW';

export const ADVERT_SELL = 1;
export const ADVERT_BUY = 2;

const destroyForm = formName => ({
    type: '@@redux-form/DESTROY',
    meta: {
        form: [
            formName,
        ]
    }
});

export const setAdvertPreview = (formPreview, extraData) =>
    (dispatch, getState) => {
        const selectedCurrency = getState().app.selectedCurrency;
        const preview = {
            additionalInfo: formPreview.additionalInfo,
            amountFrom: formPreview.cashAmount.from,
            amountTo: formPreview.cashAmount.to === '' ? undefined : formPreview.cashAmount.to,
            city: formPreview.city,
            countryCode: formPreview.countryCode,
            currency: selectedCurrency,
            fixedPrice: formPreview.fixedPrice,
            id: null,
            postalCode: formPreview.postalCode,
            percentageAdjustment: formPreview.percentageAdjustment,
            stateCode: formPreview.stateCode,
            tradeCashByMail: formPreview.acceptOptions.includes('tradeCashByMail'),
            tradeCashInPerson: formPreview.acceptOptions.includes('tradeCashInPerson'),
            tradeMoneyOrderByMail: formPreview.acceptOptions.includes('tradeMoneyOrderByMail'),
            tradeOther: formPreview.acceptOptions.includes('tradeOther'),
            travelDistance: formPreview.distance.data,
            travelDistanceUoM: formPreview.distance.prefix,
            ...extraData
        };

        dispatch({ type: SET_FORM_PREVIEW, preview });
    };

export const createBuyAdvert = (advert) =>
    async dispatch => {
        let buyAdvert = await postBuyAdvert(advert);
        dispatch(push('/'));
        dispatch(destroyForm(BuyFormName));
        dispatch({ type: CLEAR_FORM_PREVIEW});
        if(buyAdvert && buyAdvert.data)
        {
            dispatch({ type: FORM_PREVIEW_CLEARED, prevFormId: buyAdvert.data.id});
        }
    };

export const createSellAdvert = (advert) =>
    async dispatch => {
        let sellAdvert = await postSellAdvert(advert);
        dispatch(push('/'));
        dispatch(destroyForm(SellFormName));
        dispatch({ type: CLEAR_FORM_PREVIEW });
        if(sellAdvert && sellAdvert.data)
        {
            dispatch({ type: FORM_PREVIEW_CLEARED, prevFormId: sellAdvert.data.id});
        }
    };
