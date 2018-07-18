import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Helmet } from 'react-helmet';

import { getPageTitle, AdvertType } from 'utils';
import Container from 'components/layout/Container';
import { BackIcLink } from 'components/layout/Links';

import { requestAdvertDetails } from '../AdvertDetails/actions';
import { saveAdvert } from './actions';
import { ADVERT_BUY } from 'components/routes/PostingsPreview/actions';

import PostingForm from '../PostAdvert/PostingForm';
import { PriceType } from '../../../constants';

const mapAcceptOptions = a => {
    return ['tradeCashByMail', 'tradeCashInPerson', 'tradeMoneyOrderByMail', 'tradeOther']
        .filter(o => a[o]);
};

const mapAdvertDetailsToForm = a => (
    {
        ...a,
        cashAmount: {
            from: a.amountFrom && a.amountFrom.toString(),
            to: a.amountTo && a.amountTo.toString(),
            mode: a.amountTo ? 'RANGED_MODE' : 'SINGLE_MODE'
        },
        acceptOptions: mapAcceptOptions(a),
        distance: { data: a.travelDistance, prefix: a.travelDistanceUoM },
        pricePerCoin: {
            type: a.percentageAdjustment ? PriceType.PERCENT : PriceType.FIXED,
            value: a.percentageAdjustment || a.fixedPrice,
        }
    }
);

class EditAdvert extends React.Component {
    componentWillMount() {
        this.props.requestAdvertDetails(this.props.match.params.id);
    }
    onSubmit = async form => {
        const { advertDetails, saveAdvert, push } = this.props;
        const { value } = form.pricePerCoin;
        const price = form.pricePerCoin.type === PriceType.PERCENT
            ? { percentageAdjustment: value, fixedPrice: null, currency: form.pricePerCoin.currency }
            : { percentageAdjustment: null, fixedPrice: value, currency: form.pricePerCoin.currency };
        const advert = {
            additionalInfo: form.additionalInfo,
            amountFrom: form.cashAmount.from,
            amountTo: form.cashAmount.to === '' ? undefined : form.cashAmount.to,
            city: form.city,
            countryCode: form.countryCode,
            currency: form.currency,
            id: advertDetails.id,
            postalCode: form.postalCode,
            stateCode: form.stateCode,
            tradeCashByMail: form.acceptOptions.includes('tradeCashByMail'),
            tradeCashInPerson: form.acceptOptions.includes('tradeCashInPerson'),
            tradeMoneyOrderByMail: form.acceptOptions.includes('tradeMoneyOrderByMail'),
            tradeOther: form.acceptOptions.includes('tradeOther'),
            travelDistance: form.distance.data,
            travelDistanceUoM: form.distance.prefix,
            ...price,
        };
        await saveAdvert(advert);
        push(`/post/${advertDetails.id}`);
    }

    render() {
        const { countries, states, userInfo, skyPrices, advertDetails } = this.props;
        return (
            <Container flex='1 0 auto' flexDirection='column' py={5}>
                <Helmet>
                    <title>{getPageTitle('Edit advert')}</title>
                </Helmet>
                <BackIcLink path='/dashboard' text='Dashboard' />
                <PostingForm
				    form='postAdvert'
                    editMode
                    enableReinitialize
                    initialValues={mapAdvertDetailsToForm(advertDetails)}
                    countries={countries}
                    states={states}
                    skyPrices={skyPrices}
                    selectedCurrency={advertDetails.currency}
                    onSubmit={this.onSubmit}
                    user={userInfo}
                    advertType={advertDetails.type === ADVERT_BUY ? AdvertType.BUY : AdvertType.SELL} 
                />
            </Container>
        )
    }
}

const mapStateToProps = ({ app, advertDetails }) => ({
    countries: app.countries,
    states: app.states,
    skyPrices: app.skyPrices,
    userInfo: app.userInfo,
    advertDetails,
});

export default connect(mapStateToProps, { push, requestAdvertDetails, saveAdvert })(EditAdvert);
