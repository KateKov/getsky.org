import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Form, Field } from 'redux-form';
import { Box } from 'grid-styled'
import { Decimal } from 'decimal.js-light';
import get from 'lodash/get';

import { FormRangedSingleInput, FormCheckboxGroup, FormDropdownInput, FormGroup } from 'components/layout/Form';
import { Button } from 'components/layout/Button';
import { required, min, max, rangedDecimal, rangedRequired, rangedMin, rangedMax } from 'validation/rules';
import LocationFormGroup from './LocationFormGroup';
import AdditionalInformationSample from './AdditionalInformationSample';
import FormCoinPriceInput from './FormCoinPriceInput';
import { ACCEPT_TRADE_OPTIONS, DISTANCE_UNITS_OPTIONS } from 'constants/index';
import { countryInFormHasStates } from 'utils';

const RANGED_MIN = 1;
const RANGED_MAX = 999999.9999999;
const rMin = rangedMin(RANGED_MIN);
const rMax = rangedMax(RANGED_MAX);
const r = required();

const rData = required(v => v ? v.data === 0 ? 1 : v.data : v);
const minData0 = min(0, v => v.data);
const maxData9999 = max(9999, v => v.data);

const PostAdvert = ({
    advertType,
    states,
    countries,
    skyPrices,
    selectedCurrency,
    handleSubmit,
    editMode,
    theForm,
    preview,
    userCurrency,
    userDistanceUnits,
}) => {
    return (
        <Form onSubmit={handleSubmit} noValidate>
            <Box width={[1, 1, 1 / 2]}>
                <FormGroup>
                    <Field
                        name="cashAmount"
                        component={FormRangedSingleInput}
                        placeholder={'SKY'}
                        label={`What is the amount of SKY you will ${advertType}?`}
                        isRequired
                        parse={({ from, to, mode }) => {
                            return {
                                from: from !== '' ? new Decimal(from) : get(preview, 'amountFrom.d[0]', ''),
                                to: (to && to !== '') ? new Decimal(to) : '',
                                mode
                            };
                        }}
                        validate={[rangedRequired, rangedDecimal, rMin, rMax]}
                        min={RANGED_MIN}
                        max={RANGED_MAX}
                        step={0.01}
                    />
                    <Field
                        name="pricePerCoin"
                        component={FormCoinPriceInput}
                        placeholder={selectedCurrency}
                        label={'Price per coin'}
                        selectedCurrency={selectedCurrency}
                        skyPrices={skyPrices}
                        userCurrency={userCurrency}
                        isRequired
                        validate={[r]}
                    />
                    <Field
                        name="acceptOptions"
                        component={FormCheckboxGroup}
                        options={ACCEPT_TRADE_OPTIONS}
                        label={'Choose the trade options you will accept:'}
                        isRequired
                        validate={[r]}
                    />
                    <Field
                        type={'number'}
                        name={'distance'}
                        component={FormDropdownInput}
                        options={DISTANCE_UNITS_OPTIONS}
                        defaultUnits={userDistanceUnits}
                        parse={(v) => ({ ...v, data: v.data ? parseInt(v.data, 10) : '' })}
                        label={'How far will you travel to trade?'}
                        isRequired
                        min={0}
                        max={9999}
                        validate={[rData, minData0, maxData9999]}
                    />
                </FormGroup>
                <LocationFormGroup
                    states={states}
                    countries={countries}
                    showStates={countryInFormHasStates(theForm[advertType])}
                />
                <AdditionalInformationSample />
                <Button type="submit" text={editMode ? 'Save' : 'Next'} primary />
            </Box>
        </Form>
    );
}

export default connect(({ form, preview }) => ({ theForm: form, preview }))(
    reduxForm({ destroyOnUnmount: false })(PostAdvert)
);
