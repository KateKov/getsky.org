import React from 'react';
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';
import { Helmet } from 'react-helmet';
import { Box } from 'grid-styled';

import { getPageTitle, countryInFormHasStates } from 'utils';
import Container from 'components/layout/Container';

import LocationForm from './LocationForm';
import OtherSettings from './OtherSettings';
import ChangePasswordForm from './ChangePasswordForm';

import { saveUserSettings, changePassword } from './actions';

const extractFormValues = (form, names) =>
    (names.reduce((acc, curr) => {
        const extracted = {};
        extracted[curr] = form[curr];
        return { ...acc, ...extracted };
    }, {}));

export default connect(
    ({
        app: { countries, states, userInfo, skyPrices, },
        form: { userLocationSettingsForm, userOtherSettingsForm },
    }) => ({
        userInfo,
        skyPrices,

        countries,
        states,

        locationForm: userLocationSettingsForm,
        otherSettings: userOtherSettingsForm,
    }),
    {
        saveUserSettings,
        changePassword,
    })(
        class extends React.Component {
            state = {
                showOtherSuccessMessage: false,
                otherTimer: null,
                showLocationSuccessMessage: false,
                locationTimer: null,
                showChangePasswordSuccessMessage: false,
                changePasswordTimer: null,
            }
            componentWillUnmount() {
                clearInterval(this.state.otherTimer);
                clearInterval(this.state.locationTimer);
                clearInterval(this.state.changePasswordTimer);
            }
            saveOtherForm = form => {
                const {
                    saveUserSettings,
                    userInfo,

                    otherSettings,
                } = this.props;

                const otherSettingsFormRegisteredValues = ['email', 'currency', 'distanceUnits'];

                return saveUserSettings({
                    ...userInfo,
                    ...extractFormValues(otherSettings.values, otherSettingsFormRegisteredValues),
                }).then(() => {
                    const otherTimer = setTimeout(() => this.setState((state) => ({ ...state, showOtherSuccessMessage: false })), 3000);
                    this.setState((state) => ({ ...state, showOtherSuccessMessage: true, otherTimer }));
                }).catch(err => {
                    throw new SubmissionError(err)
                });
            }
            saveLocation = form => {
                const {
                    saveUserSettings,
                    userInfo,

                    locationForm,
                } = this.props;

                const locationFormRegisteredValues = ['timeOffset', 'countryCode', 'stateCode', 'city', 'postalCode'];

                return saveUserSettings({
                    ...userInfo,
                    ...extractFormValues(locationForm.values, locationFormRegisteredValues),
                    timeOffset: parseInt(locationForm.values.timeOffset, 10),
                }).then(() => {
                    const locationTimer = setTimeout(() => this.setState((state) => ({ ...state, showLocationSuccessMessage: false })), 3000);
                    this.setState((state) => ({ ...state, showLocationSuccessMessage: true, locationTimer }));
                }).catch(err => {
                    throw new SubmissionError(err)
                });
            }
            changePassword = form => {
                return this.props.changePassword(form)
                    .then(() => {
                        const changePasswordTimer = setTimeout(() => this.setState((state) => ({ ...state, showChangePasswordSuccessMessage: false })), 3000);
                        this.setState((state) => ({ ...state, showChangePasswordSuccessMessage: true, changePasswordTimer }));
                    }).catch(err => {
                        throw new SubmissionError(err)
                    });
            }
            render() {
                const {
                    locationForm,

                    countries,
                    states,
                    skyPrices,

                    userInfo,
                } = this.props;

                return (
                    <Container flex='1 0 auto' flexDirection="column" py={5}>
                        <Helmet><title>{getPageTitle('User settings')}</title></Helmet>
                        <h2>Your location</h2>
                        <LocationForm
                            enableReinitialize
                            initialValues={userInfo && { ...userInfo, timeOffset: userInfo.timeOffset.toString() }}
                            countries={countries}
                            states={states}
                            showStates={countryInFormHasStates(locationForm)}
                            onSubmit={this.saveLocation}
                            showSuccessMessage={this.state.showLocationSuccessMessage}
                        />

                        <Box mt={'30px'}>
                            <h2>Other settings</h2>
                            <OtherSettings
                                currencies={Object.keys(skyPrices)}
                                enableReinitialize
                                initialValues={userInfo && { ...userInfo, timeOffset: userInfo.timeOffset.toString() }}
                                onSubmit={this.saveOtherForm}
                                showSuccessMessage={this.state.showOtherSuccessMessage}
                            />
                        </Box>

                        <Box mt={'30px'}>
                            <h2>Change your password</h2>
                            <ChangePasswordForm
                                onSubmit={this.changePassword}
                                showSuccessMessage={this.state.showChangePasswordSuccessMessage}
                            />
                        </Box>
                    </Container>
                );
            }
        });
