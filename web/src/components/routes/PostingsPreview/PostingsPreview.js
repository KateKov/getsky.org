import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Box } from 'grid-styled';
import { Helmet } from 'react-helmet';

import { getPageTitle, AdvertType, getAdvertTypeFromLocation } from 'utils';
import Container from 'components/layout/Container';
import { BackIcLink } from 'components/layout/Links';
import { H1, B, P } from 'components/layout/Text';
import { Warning } from 'components/layout/Alerts';
import FormPreview from './FormPreview';
import { createBuyAdvert, createSellAdvert } from './actions';

const ExchangeRateWarningBuy = () => (
    <Box mb={'10px'}>
        <Warning>
            <B>
                The amount of SKY shown in the advert may change with the exchange rate of USD.
            </B>
            The actual amount of SKY will need to be determined between the seller and buyer.
            <P>
                <B>Posting this seller advert will deduct one credit from your balance.</B>
            </P>
        </Warning>
    </Box>
);

const ExchangeRateWarningSell = () => (
    <Box mb={'10px'}>
        <Warning>
            <B>
                The amount of SKY shown in the advert may change with the exchange rate of USD.
            </B>
            The actual amount of SKY will need to be determined between the seller and buyer.
        </Warning>
    </Box>
);

class PostingsPreview extends React.Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillMount() {
        if (!this.props.preview) {
            const advertType = getAdvertTypeFromLocation(this.props.location);
            this.props.push(`/postings/${advertType}`)
        }
    }

    onSubmit(form) {
        const advertType = getAdvertTypeFromLocation(this.props.location);
        const preparedPreview = { ...this.props.preview, recaptcha: form.recaptcha };

        if (advertType === AdvertType.BUY) {
            this.props.createBuyAdvert(preparedPreview);
        } else {
            this.props.createSellAdvert(preparedPreview);
        }
    }

    render() {
        const { states, countries, preview, location, skyPrices } = this.props;
        const advertType = getAdvertTypeFromLocation(location);

        return (
            <Container flex='1 0 auto' flexDirection='column' py={5}>
                <Helmet><title>{getPageTitle(advertType === AdvertType.BUY ? 'Buy advert preview' : 'Sell advert preview')}</title></Helmet>
                <BackIcLink path={`/postings/${advertType}`} text='Edit advert' />
                <H1>Advert preview</H1>
                {advertType === AdvertType.BUY
                    ? <ExchangeRateWarningBuy />
                    : <ExchangeRateWarningSell />
                }
                <FormPreview onSubmit={this.onSubmit} countries={countries} states={states} details={preview} skyPrices={skyPrices} />
            </Container>
        )
    }
}

const mapStateToProps = ({ preview, app }) => ({
    preview: preview.preview,
    countries: app.countries,
    states: app.states,
    skyPrices: app.skyPrices,
});

export default connect(mapStateToProps, { push, createBuyAdvert, createSellAdvert })(PostingsPreview);
