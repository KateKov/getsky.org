import React from 'react';
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';
import { Helmet } from 'react-helmet';
import { Box } from 'grid-styled';
import moment from 'moment';

import { getPageTitle } from 'utils';
import Container from 'components/layout/Container';
import { H2 } from 'components/layout/Text';
import RegistrationForm from './RegistrationForm';
import { register } from './actions'

class Registration extends React.Component {
    onSubmit = (user) => {
        const { registerUser } = this.props;

        return registerUser(user)
            .catch(err => {
                if(err['error'] && err['field'] && err['error'] === 'duplicate')
                {
                    const fieldName =  err['field'];
                    const errorMessage =  "An account with this " + fieldName.toLowerCase() + " has already been registered.";
                    throw new SubmissionError({[fieldName]: errorMessage});
                }
  
                throw new SubmissionError(err)
            });
    }

    render() {
        return (
            <Container flex='1 0 auto' flexDirection="column" py={5}>
                <Helmet><title>{getPageTitle('Registration')}</title></Helmet>
                <H2>Registration</H2>
                <Box mt={2}>
                    <RegistrationForm onSubmit={this.onSubmit} initialValues={{ timeOffset: moment().utcOffset() / 60 }} />
                </Box>
            </Container>
        );
    }
}

export default connect(null, { registerUser: register })(Registration)
