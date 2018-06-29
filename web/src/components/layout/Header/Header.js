import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Flex } from 'grid-styled';
import { push } from 'react-router-redux'

import Container from 'components/layout/Container';
import Brand from 'components/layout/Brand';
import UserSubmenu from 'components/layout/UserSubmenu';
import SkyPrice from 'components/layout/SkyPrice';
import theme from 'components/theme';
import { logout } from 'components/routes/Login/actions';
import { changeSelectedCurrency } from 'components/AppInitializer/actions';

import Navigation from './Navigation';

const SubHeaderWrapper = styled(Flex)`
    background: ${props => props.theme.colors.darkBlue};
    height: 38px;
`;

const HeaderWrapper = styled(Flex)`
    height: 102px;
`;

const noAuthNavItems = [
    { url: '/search', name: 'Search', border: false },
    { url: '/contact-us', name: 'Contact', border: false },
    { url: '/faq', name: 'FAQ', border: false },
    { url: '/skycoin', name: 'Skycoin', border: false },
    { url: '/register', name: 'Register', border: false },
    { url: '/login', name: 'Login', border: true },
];

const authNavItems = [
    { url: '/search', name: 'Search', border: false },
    { url: '/contact-us', name: 'Contact', border: false },
    { url: '/faq', name: 'FAQ', border: false },
    { url: '/skycoin', name: 'Skycoin', border: false },
];

const HomePageStyle = { position: 'absolute', width: '100%' };
const OtherPagesStyle = { backgroundColor: theme.colors.black };

const Header = ({ authorized, userInfo, skyPrices, selectedCurrency, location, logout, push, changeSelectedCurrency }) => (
    <header style={{ overflow: 'hidden' }}>
        <SubHeaderWrapper>
            <Container alignItems={'center'} justifyContent={'space-between'}>
                <SkyPrice skyPrices={skyPrices} selectedCurrency={selectedCurrency} changeSelectedCurrency={changeSelectedCurrency} />
                {authorized && <UserSubmenu push={push} userInfo={userInfo} logout={logout} />}
            </Container>
        </SubHeaderWrapper>
        <HeaderWrapper alignItems={'center'} justifyContent={'space-between'} style={location === '/' ? HomePageStyle : OtherPagesStyle}>
            <Container alignItems={'center'} justifyContent={'space-between'}>
                <Brand />
                <Navigation navItems={authorized ? authNavItems : noAuthNavItems} isMobile />
            </Container>
        </HeaderWrapper>
    </header>
);

Header.propTypes = {
    authorized: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ login, app, routing }) => {
    return {
        location: routing.location.pathname,
        authorized: login.authorized,
        userInfo: app.userInfo,
        skyPrices: app.skyPrices,
        selectedCurrency: app.selectedCurrency,
        currencies: app.currencies,
    }
};

export default connect(mapStateToProps, { logout, push, changeSelectedCurrency, })(Header);
