export const TRADE_OPTIONS = {
    tradeCashInPerson: 'Cash in person',
    tradeCashByMail: 'Cash by mail',
    tradeMoneyOrderByMail: 'Money Order by mail',
    tradeOther: 'Other',
};

export const RE_CAPTCHA_KEY = process.env.REACT_APP_RECAPTCHA_KEY || '6LcIDlkUAAAAACqwh2NQTvvpXzGxTNrfluexYDhL';

export const SellFormName = 'sell';
export const BuyFormName = 'buy';

export const ACCEPT_TRADE_OPTIONS = [{
    title: 'Cash in person',
    value: 'tradeCashInPerson',
}, {
    title: 'Cash by mail',
    value: 'tradeCashByMail',
}, {
    title: 'Money Order by mail',
    value: 'tradeMoneyOrderByMail',
}, {
    title: 'Other',
    value: 'tradeOther',
}];

export const DISTANCE_UNITS_OPTIONS = [{
    text: 'Miles',
    value: 'mi',
}, {
    text: 'Kilometers',
    value: 'km',
}];

export const PriceType = {
    PERCENT: 'PERCENTAGE_ADJUSTMENT',
    FIXED: 'FIXED_PRICE'
};
