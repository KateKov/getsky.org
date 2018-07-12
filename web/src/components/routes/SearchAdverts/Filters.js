import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Flex, Box } from 'grid-styled';
import { Field, Fields, reduxForm, Form, formValueSelector, change } from 'redux-form';
import { FormDropdown, FormInput, FormCheckbox, FormLabel } from 'components/layout/Form';
import { Button } from 'components/layout/Button';
import { ACCEPT_TRADE_OPTIONS } from 'constants/index';
import { countryHasStates } from 'utils';

const ConnectedDropdowns = (props) => {
    return (
        <Flex mx={-4} flexWrap="wrap">
            <Box w={[1, 1, 1 / 3]} px={4}>
                <FormDropdown
                    {...props.countryCode}
                    options={props.countries}
                    triggerOnChange={false}
                    label="Country"
                />
            </Box>
            <Box w={[1, 1, 1 / 3]} px={4}>
                <FormDropdown
                    {...props.stateCode}
                    options={props.states}
                    triggerOnChange={false}
                    disabled={!countryHasStates(props.countryCode.input.value)}
                    label="State"
                />
            </Box>
            <Box w={[1, 1, 1 / 3]} px={4}>
                <FormDropdown
                    {...props.currency}
                    options={props.currencies}
                    triggerOnChange={false}
                    label="Currency"
                />
            </Box>
        </Flex>
    )
};

const Amount = styled(Box)`
    flex-grow: 1;
`;

const Hr = styled.hr`
    border: none;
    width: 100%;
    height: 2px;
    background: ${props => props.theme.colors.darkGray}; 
`;

class Filters extends React.PureComponent {
    componentWillUpdate(nextProps) {
        const { countryCode, stateCode } = this.props;
        if (countryCode !== nextProps.countryCode && !countryHasStates(nextProps.countryCode) && stateCode !== '') {
            this.props.dispatch(change('filters', 'stateCode', ''));
        }
    }

    render() {
        const { countries, states, currencies, handleSubmit } = this.props;

        return (
            <Form onSubmit={handleSubmit} noValidate>
                <Flex py={4} mx={-4} flexWrap="wrap">
                    <Box w={[1, 1, 1 / 2]} px={4}>
                        <Fields
                            names={['countryCode', 'stateCode', 'currency']}
                            component={ConnectedDropdowns}
                            countries={countries}
                            states={states}
                            currencies={currencies}
                        />
                    </Box>
                    <Box w={[1, 1 / 2, 1 / 4]} px={4}>
                        <Field component={FormInput} name="city" label="City" />
                    </Box>
                    <Flex w={[1, 1 / 2, 1 / 4]} px={4}>
                        <Amount pr={2}>
                            <Field component={FormInput} name="amount" label="Amount (SKY)" />
                        </Amount>
                    </Flex>
                </Flex>
                <Hr />
                <Flex py={4} mx={-4} flexWrap="wrap" alignItems="flex-end">
                    <Box w={[1, 1, 3 / 4]} px={4}>
                        <FormLabel>Trade</FormLabel>
                        <Flex flexWrap="wrap">
                            {ACCEPT_TRADE_OPTIONS.length > 0
                                && ACCEPT_TRADE_OPTIONS.map(o =>
                                    <Field key={`filter-${o.title}`} component={FormCheckbox} name={o.value} label={o.title} />
                                )}
                        </Flex>
                    </Box>
                    <Box w={[1, 1, 1 / 4]} px={4} pt={[4, 0, 0]}>
                        <Button type="submit" text="Search" primary block />
                    </Box>
                </Flex>
            </Form>
        );
    }
}

Filters = reduxForm({
    form: 'filters',
    enableReinitialize: true,
    initialValues: {
        tradeCashInPerson: false,
        tradeCashByMail: false,
        tradeMoneyOrderByMail: false,
        tradeOther: false,
    },
})(Filters);

const formSelector = formValueSelector('filters');

const mapStateToProps = state => ({
    initialValues: state.search.filters,
    countryCode: formSelector(state, 'countryCode'),
    stateCode: formSelector(state, 'stateCode'),
});

Filters = connect(mapStateToProps)(Filters);

export default Filters;
