import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Helmet } from 'react-helmet';

import { getPageTitle } from 'utils';
import Container from 'components/layout/Container';
import { H2 } from 'components/layout/Text';
import ContactUsForm from './ContactUsForm';
import { submitFeedbackForm } from './actions';
import SuccessConfirm from './SuccessConfirm';

class ContactUs extends React.Component {
    state = {
        successConfirmationVisible: false,
    }

    toggleSuccessConfirmation = () => {
        this.setState(() => ({
            successConfirmationVisible: !this.state.successConfirmationVisible
        }));
    }

    handleSubmit = form => {
        const { submitFeedbackForm } = this.props;

        return submitFeedbackForm(form)
            .then(() => {
                this.toggleSuccessConfirmation();
            });
    }
    render() {
        return (
            <Container flex='1 0 auto' flexDirection="column" py={5}>
                <SuccessConfirm
                    isOpen={this.state.successConfirmationVisible}
                    onClose={this.toggleSuccessConfirmation}
                />
                <Helmet><title>{getPageTitle('Contact us')}</title></Helmet>
                <H2 my={[4, 6]}>Contact us</H2>
                <ContactUsForm onSubmit={this.handleSubmit} />
            </Container>);
    }
}

export default connect(null, { submitFeedbackForm, push })(ContactUs);
