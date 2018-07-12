import React from 'react';
import { connect } from 'react-redux';
import PostAdvert from '../PostAdvert';

const advertType = "buy";

const PostAdvertBuy = ({ countries, states, userInfo, skyPrices, selectedCurrency, preview }) => {
    return (
        <PostAdvert
            advertType={advertType}
            preview={preview}
            countries={countries}
            states={states}
            userInfo={userInfo}
            skyPrices={skyPrices}
            selectedCurrency={selectedCurrency}
        />
    );
}

const mapStateToProps = ({ app, preview }) => ({
    countries: app.countries,
    states: app.states,
    userInfo: app.userInfo,
    skyPrices: app.skyPrices,
    selectedCurrency: app.selectedCurrency,
    preview: preview.preview,
})

export default connect(mapStateToProps)(PostAdvertBuy);
