import React from 'react';
import { connect } from 'react-redux';
import { initApp, getCountries, getStates, getUserInfo, requestSkycoinPrice, setDefaultCurrency } from './actions'

class AppInitializer extends React.Component {
    componentWillMount() {
        this.props.initApp();
        this.props.setDefaultCurrency();
        this.props.getCountries();
        this.props.getStates();
        this.props.getUserInfo();
        this.props.requestSkycoinPrice();
    }

    render() {
        return this.props.children;
    }
}


export default connect(({ app }) => ({ app }), {
    initApp,
    getCountries,
    getStates,
    getUserInfo,
    requestSkycoinPrice,
    setDefaultCurrency,
})(AppInitializer)
