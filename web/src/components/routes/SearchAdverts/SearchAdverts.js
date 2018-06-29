import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import qs from 'qs';
import _ from 'lodash';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';

import { getPageTitle } from 'utils';
import Container from 'components/layout/Container';
import Spinner from 'components/layout/Spinner';
import Table from 'components/layout/Table';
import { AdvertRow } from 'components/layout/TableAdverts';
import { Tab, Tabs, TabList, TabPanel } from 'components/layout/Tabs';
import Filters from './Filters';

import { searchAdverts, setFilters, clearFilters } from "./actions";

const buyAdvertsColumns = [
    { name: 'Seller' },
    { name: 'Will sell' },
    { name: 'Trade options' },
    { name: 'Expired', style: { width: '170px' } },
];

const sellAdvertsColumns = [
    { name: 'Buyer' },
    { name: 'Will buy' },
    { name: 'Trade options' },
    { name: 'Expired', style: { width: '170px' } },
];

const BreadcrumbLink = styled(Link) `
    font-size: 12px;
    color: ${props => props.theme.colors.grayBlue};
`;

const BreadcrumbLabel = styled.span`
    font-size: 12px;
    color: ${props => props.theme.colors.grayBlue};
    
    &:before {
        content: '/';
        margin-left: ${props => props.theme.space[2]}px;
        margin-right: ${props => props.theme.space[2]}px;
    }
`;

const FiltersWrapper = styled.div`
    background: ${props => props.theme.colors.lightGray2};
`;

const TabsWrapper = styled.div`
    box-shadow: 0 -8px 10px 2px rgba(0,114,255,0.07);
`;

const Title = styled.h2`
    color: ${props => props.theme.colors.grayBlue};
    font-size: 28px;
    line-height: 36px;
`;

const Badge = styled.span`
    display: inline-block;
    font-size: 18px;
    width: 36px;
    height: 36px;
    border-radius: 100%;
    background: ${props => props.theme.colors.blue};
    color: ${props => props.theme.colors.white};
    margin-left: ${props => props.theme.space[3]}px;
    text-align: center;
    vertical-align: top;
`;

const mapAdverts = (adverts, prices, selectedCurrency) => adverts.map(a => ({ ...a, price: prices[a.currency], selectedCurrency,  selectedCurrencyPrice: prices[selectedCurrency] }));

class SearchAdverts extends React.Component {
    componentWillMount() {
        const { location } = this.props;

        this.props.searchAdverts(location.search);
    }
    componentDidMount() {
        const { location } = this.props;
        const filters = qs.parse(location.search.replace('?', ''));

        if (!_.isEmpty(filters)) {
            this.props.setFilters(filters);
        }
    }

    componentWillUnmount() {
        this.props.clearFilters();
    }

    handleFiltersChange = (values, dispatch, props, previousValues) => {
        const filters = _.pickBy(_.merge(previousValues, values), el => !!el);
        const queryString = qs.stringify(filters);
        dispatch(push({
            search: `?${queryString}`
        }));
    };

    handleSubmit = (values, dispatch, props) => {
        const query = props.query || '';
        this.props.searchAdverts(query);
    };

    prepareCurrencies = (currencies) => {
        let currenciesData = [];
        currencies.forEach(function (c) {
            currenciesData.push({ text: c, value: c })
        });
        return currenciesData;
    };

    render() {
        const {
            countries,
            states,
            location,
            search: { buyAdverts, sellAdverts, loading },
            skyPrices,
            selectedCurrency, } = this.props;

        return (
            <div>
                <Helmet><title>{getPageTitle('Search advert')}</title></Helmet>
                <Container flex="1 0 auto" flexDirection="row" py={4}>
                    <BreadcrumbLink to="/">Home</BreadcrumbLink>
                    <BreadcrumbLabel>Search adverts</BreadcrumbLabel>
                </Container>
                <FiltersWrapper>
                    <Container flex="1 0 auto" flexDirection="column" py={5}>
                        <Filters
                            countries={countries}
                            states={states}
                            currencies={this.prepareCurrencies([])}
                            onChange={this.handleFiltersChange}
                            onSubmit={this.handleSubmit}
                            query={location.search}
                        />
                    </Container>
                </FiltersWrapper>

                <TabsWrapper>
                    <Tabs>
                        <TabList>
                            <Tab tab={'buy-tab'}><strong>Buy Skycoin</strong></Tab>
                            <Tab tab={'sell-tab'}><strong>Sell Skycoin</strong></Tab>
                        </TabList>
                        <TabPanel>
                            <Container flex='1 0 auto' flexDirection="column" pt={9}>
                                {loading && <Spinner />}
                                {!loading && <div>
                                    <Title>
                                        Seller adverts
                                        {sellAdverts.length > 0 && <Badge>{sellAdverts.length}</Badge>}
                                    </Title>
                                    <Table columns={buyAdvertsColumns} rowComponent={AdvertRow}
                                        rowData={mapAdverts(sellAdverts, skyPrices, selectedCurrency)} />
                                </div>
                                }
                            </Container>
                        </TabPanel>
                        <TabPanel>
                            <Container flex='1 0 auto' flexDirection="column" pt={9}>
                                {loading && <Spinner />}
                                {!loading &&
                                    <div>
                                        <Title>
                                            Buyer adverts
                                        {buyAdverts.length > 0 && <Badge>{buyAdverts.length}</Badge>}
                                        </Title>
                                        <Table columns={sellAdvertsColumns} rowComponent={AdvertRow}
                                            rowData={mapAdverts(buyAdverts, skyPrices, selectedCurrency)} />
                                    </div>
                                }
                            </Container>
                        </TabPanel>
                    </Tabs>
                </TabsWrapper>

            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    countries: state.app.countries,
    states: state.app.states,
    search: state.search,
    skyPrices: state.app.skyPrices,
    selectedCurrency: state.app.selectedCurrency,
});

export default connect(mapStateToProps, ({ searchAdverts, setFilters, clearFilters }))(SearchAdverts);

