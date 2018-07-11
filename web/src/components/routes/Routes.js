import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import LatestAdverts from './LatestAdverts';
import SearchAdverts from './SearchAdverts';
import Registration from './Registration';
import Login from './Login';
import PostAdvertBuy from './PostAdvertBuy';
import PostAdvertSell from './PostAdvertSell';
import PostingsPreview from './PostingsPreview';
import AdvertDetails from './AdvertDetails';
import UserSettings from './UserSettings';
import Dashboard from './Dashboard';
import EditPosting from './EditPosting';
import ContactUs from './ContactUs';
import NotFound from './NotFound';
import {
    ForgotPassword,
    ResetPassword,
} from './ForgotPassword';

import {
    Terms,
    Privacy,
    FAQ,
    WhySkycoin,
} from './Content';


const OnlyNotAuthorizedRoute = connect(({ login }) => ({
    login
}), null)(({ login, ...props }) => {
    if (login.authorized &&
        (props.location.pathname === '/login' ||
            props.location.pathname === '/register' ||
            props.location.pathname === '/forgot-password' ||
            props.location.pathname === '/password-recovery')
    ) {
        return <Redirect to={{ pathname: '/dashboard', state: { from: props.location } }} />;
    }

    return <Route {...props} />;
});

const PrivateRoute = connect(({ login }) => ({
    login
}), null)(({ login, ...props }) => {
    if (login.authorized) {
        return <Route {...props} />
    }

    return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
});

const Routes = ({ match }) => {
    return (
        <Switch>
            <Route path={`/search`} component={SearchAdverts} />
            <Route path={`/post/:id`} component={AdvertDetails} />
            <Route path={`/contact-us`} component={ContactUs} />

            <Route path={`/skycoin`} component={WhySkycoin} />
            <Route path={`/faq`} component={FAQ} />
            <Route path={`/terms`} component={Terms} />
            <Route path={`/privacy`} component={Privacy} />

            <OnlyNotAuthorizedRoute path={`/register`} component={Registration} />
            <OnlyNotAuthorizedRoute path={`/login`} component={Login} />
            <OnlyNotAuthorizedRoute path={`/forgot-password`} component={ForgotPassword} />
            <OnlyNotAuthorizedRoute path={`/password-recovery`} component={ResetPassword} />

            <PrivateRoute path={`/dashboard`} component={Dashboard} />
            <PrivateRoute path={`/user-settings`} component={UserSettings} />
            <PrivateRoute path={`/postings/:type(sell|buy)/preview`}  component={PostingsPreview} />
             <PrivateRoute path={`/postings/buy`} component={PostAdvertBuy} />
             <PrivateRoute path={`/postings/sell`} component={PostAdvertSell} />
            <PrivateRoute path={`/edit-post/:id`} component={EditPosting} />

            <Route path={`/`} exact component={LatestAdverts} />
            <Route component={NotFound}/>
        </Switch>
    );
};

Routes.propTypes = {
    match: PropTypes.shape({
        url: PropTypes.string.isRequired,
    }).isRequired,
};

export default Routes;
