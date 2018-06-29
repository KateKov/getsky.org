import React from 'react';
import { Field, reduxForm, Form } from 'redux-form';
import { Box } from 'grid-styled';

import { FormInput, FormDropdown, FormMessage, } from 'components/layout/Form';
import { Submit } from 'components/layout/Button';

const distanceUnits = [
    { text: 'Kilometers', value: 'km' },
    { text: 'Miles', value: 'ml' }
];

export default reduxForm({ form: 'userOtherSettingsForm' })(
    class extends React.Component {
        render() {
            const {
                handleSubmit,
                pristine,
                submitting,
                showSuccessMessage,
                currencies,
            } = this.props;

            const cs = currencies.map(c => ({ text: c, value: c }));

            return (
                <Form onSubmit={handleSubmit}>
                    <Box width={[1, 1, 1 / 2]}>
                        {showSuccessMessage && <FormMessage>Settings updated</FormMessage>}
                        <Field
                            name="email"
                            component={FormInput}
                            type="text"
                            label="Email"
                            placeholder="Email"
                            description="Enter your email if you would like to receive notifications when someone responds to your advert. We do not sell, share, or make your email address known to others."
                        />

                        <Field
                            name="distanceUnits"
                            component={FormDropdown}
                            options={distanceUnits}
                            label="Distance units" />

                        <Field
                            name="currency"
                            component={FormDropdown}
                            options={cs}
                            label="Currency" />

                        <Submit disabled={pristine || submitting} showSpinner={submitting} text="Save" primary />
                    </Box>
                </Form>
            )
        }
    });
