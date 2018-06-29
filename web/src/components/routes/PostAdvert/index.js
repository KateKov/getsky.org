import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Helmet } from 'react-helmet';
import get from 'lodash/get';

import { getPageTitle, getAdvertTypeFromLocation, AdvertType } from 'utils';
import Container from 'components/layout/Container';
import { BackIcLink } from 'components/layout/Links';
import { setAdvertPreview, ADVERT_SELL, ADVERT_BUY } from 'components/routes/PostingsPreview/actions';
import { PriceType } from '../../../constants';

import PostingForm from './PostingForm';
import { SellTitle, BuyTitle } from './Title';

const oKeys = ['tradeCashInPerson', 'tradeCashByMail', 'tradeMoneyOrderByMail', 'tradeOther'];

const mapAcceptOptions = a => {
    return ['tradeCashByMail', 'tradeCashInPerson', 'tradeMoneyOrderByMail', 'tradeOther']
        .filter(o => a[o]);
};

function getAmountValue(obj, key) {
    if (!obj) {
        return '';
    }

    if (typeof obj[key] === 'object') {
        return obj[key].toString()
    }
    if (obj[key]) {
        return obj[key]
    }
}

class PostAdvert extends React.Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }
    getAdvertType = () => getAdvertTypeFromLocation(this.props.location);

    getInitialFormValues = () => {
        const { preview, userInfo, countries } = this.props;
        const pricePerCoin = get(preview, 'percentageAdjustment', '') || get(preview, 'fixedPrice', '');
        const acceptOptions = preview ? mapAcceptOptions(preview) : [];
        const from = getAmountValue(preview, 'amountFrom');
        const to = getAmountValue(preview, 'amountTo');
        
        return {
            ...userInfo,
            distance: { 
                data: get(preview, 'travelDistance', ''),
                prefix: get(preview, 'travelDistanceUoM', ''),
            },
            pricePerCoin: { type: PriceType.PERCENT, value: pricePerCoin },
            city: get(preview, 'city', ''),
            postalCode: get(preview, 'postalCode', ''),
            travelDistanceUoM: get(preview, 'travelDistanceUoM', ''),
            additionalInfo: get(preview, 'additionalInfo', ''),
            cashAmount: {
                from,
                to,
                mode: ((preview && preview.amountTo) || (!preview) ) ? 'RANGED_MODE' : 'SINGLE_MODE',
            },
            acceptOptions,
            countryCode: get(preview, 'countryCode', ''),
        }
    }

    onSubmit(form) {
        const advertType = this.getAdvertType();
        const type = advertType === AdvertType.BUY ? ADVERT_BUY : ADVERT_SELL;
        const value = form.pricePerCoin.value;
        const extraData = form.pricePerCoin.type === PriceType.PERCENT
            ? { percentageAdjustment: value, fixedPrice: null, author: this.props.userInfo.username, type }
            : { percentageAdjustment: null, fixedPrice: value, author: this.props.userInfo.username, type };

        this.props.setAdvertPreview(form, extraData);
        this.props.push(`/postings/${advertType}/preview`);
    }

    render() {
        const { countries, states, userInfo, skyPrices, selectedCurrency } = this.props;
        const advertType = this.getAdvertType();
        const PostingTitle = advertType === AdvertType.BUY ? BuyTitle : SellTitle;
        const initialValues = userInfo ? this.getInitialFormValues() : '';

        return (
            <Container flex='1 0 auto' flexDirection='column' py={5}>
                <Helmet><title>{getPageTitle(`${advertType === AdvertType.SELL ? 'Sell' : 'Buy'} advert`)}</title></Helmet>
                <BackIcLink path='/dashboard' text='Dashboard' />
                <PostingTitle />
                {userInfo && <PostingForm
                    advertType={advertType}
                    countries={countries}
                    states={states}
                    onSubmit={this.onSubmit}
                    skyPrices={skyPrices}
                    selectedCurrency={selectedCurrency}
                    initialValues={initialValues}
                    enableReinitialize
                />}
            </Container>
        )
    }
}

const mapStateToProps = ({ app, preview, form }) => ({
    countries: app.countries,
    states: app.states,
    userInfo: app.userInfo,
    skyPrices: app.skyPrices,
    selectedCurrency: app.selectedCurrency,
    preview: preview.preview,
})

export default connect(mapStateToProps, { setAdvertPreview, push })(PostAdvert);
