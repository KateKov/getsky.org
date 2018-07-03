import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, Form, SubmissionError } from 'redux-form';
import { Box } from 'grid-styled';
import { Helmet } from 'react-helmet';

import { getPageTitle } from 'utils';
import Container from 'components/layout/Container';
import { H2 } from 'components/layout/Text';
import { Submit } from 'components/layout/Button';
import { FormInput, FormCaptcha, FormMessage } from 'components/layout/Form';

import { required } from 'validation/rules';

import { resetPassword } from './actions';

const r = required();
const emailRequired = (value) => value === 0 || value ? undefined : "Email field can't be blank";

const ForgotPasswordForm = reduxForm({
    form: 'forgotPasswordForm',
})(class extends React.Component {
    componentDidUpdate(prevProps, prevState) {
        // Reset captcha after receiving response
        if (prevProps.submitting && prevProps.submitting !== this.props.submitting) {
            const cptCmp = this.recaptchaField.getRenderedComponent();
            cptCmp.resetRecaptcha();
        }
    }
    render() {
        const {
            handleSubmit,
            pristine,
            submitting,
        } = this.props;

        return (
            <Form onSubmit={handleSubmit}>
                <Box width={[1, 1, 1 / 2]}>
                    <Field name="email"  validate={[emailRequired]} component={FormInput} type="email" label="Email" placeholder="Email" isRequired />
                    <Field name="recaptcha" component={FormCaptcha} validate={[r]} withRef ref={r => { this.recaptchaField = r }} isRequired />
                </Box>

                <Submit disabled={pristine || submitting} showSpinner={submitting} text="Reset your password" primary />
            </Form>
        );
    }
})

class ForgotPassword extends React.Component {
    state = {
        passwordBeenReset: false,
    }
    resetPassword = async () => {
        const { form, resetPassword } = this.props;
        return resetPassword(form.values.email, form.values.recaptcha)
            .then(() => this.setState({ passwordBeenReset: true }))
            .catch((err) => {
                throw new SubmissionError(err);
            });
    }
    render() {
        return (
            <Container flex='1 0 auto' flexDirection="column" py={5}>
                <Helmet>
                    <title>{getPageTitle('Password recovery')}</title>
                </Helmet>
                <H2>Forgot your password?</H2>
                {this.state.passwordBeenReset && <FormMessage color="success">
                    If that was a valid email address, an email has been sent to you. Please check your email (including your Spam box) for further instructions.
                </FormMessage>}
                {!this.state.passwordBeenReset && <FormMessage color="warningTransparent">
                    If you entered an email address in your settings page, complete this form with that email address. We'll then send an email with further information.
                </FormMessage>}

                <ForgotPasswordForm onSubmit={this.resetPassword} />
            </Container>
        );
    }
}

export default connect(({
    form: { forgotPasswordForm },
}) => ({
    form: forgotPasswordForm
}), { resetPassword })(ForgotPassword);
