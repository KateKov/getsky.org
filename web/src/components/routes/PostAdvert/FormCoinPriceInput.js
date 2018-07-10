import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from 'grid-styled';

import { B, Tip, Span } from 'components/layout/Text';
import { Button } from 'components/layout/Button';
import { ControlInput, FormItem, ControlDropdown } from 'components/layout/Form';
import TipToggles from 'components/layout/TipToggles';
import { round } from 'utils/';
import { PriceType } from 'constants/index';

const fullWidth = { width: '100%' };
const skyPriceWithPercents = (skyPrice, percent) => {
    const extra = skyPrice * percent;
    return round((parseFloat(skyPrice, 10) + extra), 2);
};

const PercentageAdjustmentTip = ({ skyPrice }) => (
    <Box>
        <Tip><B>A percentage (up to two decimal places) you want applied to the SKY exchange rate price.</B></Tip>
        <Tip>Example: 10</Tip>
        <Tip>At the time of the trade, if the SKY exchange rate price is <B>100 USD</B> and you choose <B>10</B> to indicate 10%, you will be selling your SKY for <B>110 USD</B> each.</Tip>
        <Box mt={3}>
            <TipToggles label={'Exchange rate examples'}>
                <Flex>
                    <Box width={1 / 4}><Tip>0% = {round(skyPrice, 2)} USD</Tip></Box>
                    <Box width={1 / 4}><Tip>2% = {skyPriceWithPercents(skyPrice, 0.02)} USD</Tip></Box>
                    <Box width={1 / 4}><Tip>4% = {skyPriceWithPercents(skyPrice, 0.04)} USD</Tip></Box>
                    <Box width={1 / 4}><Tip>6% = {skyPriceWithPercents(skyPrice, 0.06)} USD</Tip></Box>
                </Flex>
                <Flex mt={2}>
                    <Box width={1 / 4}><Tip>8% = {skyPriceWithPercents(skyPrice, 0.08)} USD</Tip></Box>
                    <Box width={1 / 4}><Tip>10% = {skyPriceWithPercents(skyPrice, 0.1)} USD</Tip></Box>
                    <Box width={1 / 4}><Tip>12% = {skyPriceWithPercents(skyPrice, 0.12)} USD</Tip></Box>
                    <Box width={1 / 4}><Tip>14% = {skyPriceWithPercents(skyPrice, 0.14)} USD</Tip></Box>
                </Flex>
            </TipToggles>
        </Box>
    </Box>
);

const FixedPriceTip = () => (
    <Box>
        <Tip>Up to two decimal places. The exchange rate <B>will not</B> alter this price.</Tip>
        <Tip>Example: 200</Tip>
        <Tip>This means you will sell your SKY at 200 USD each.</Tip>
    </Box>
);

const Label = ({ skyPrice, selectedCurrency }) => (
    <Span>
        Price per coin (last price from <a href={'https://coinmarketcap.com/currencies/skycoin/'}>coinmarketcap.com</a> = {round(skyPrice, 2)} {selectedCurrency})
    </Span>
);

const getCurrencies = (skyPrices) => {
    if (skyPrices !== null) {
        return Object.keys(skyPrices).map(v => ({ text: v, value: v }));
    }
    return [];
}

class FormCoinPriceInput extends React.Component {
    componentDidMount() {
        const { input: { onChange } } = this.props;
        onChange({ value: '', type: PriceType.PERCENT, currency: this.props.userCurrency || 'USD' });
    };
    componentDidUpdate(prevProps) {
        if (this.props.userCurrency !== prevProps.userCurrency) {
            this.onChangeCurrency(prevProps.userCurrency);
        }
    };
    setMode = mode => {
        const { input: { value, onChange } } = this.props;
        onChange({ value: value.value, type: mode, currency: value.currency });
    };
    onChange = e => {
        const { input: { value, onChange } } = this.props;
        const val = e.target.value;
        const newValue = isNaN(parseFloat(val)) ? '' : parseFloat(val);

        onChange({ value: newValue, type: value.type, currency: value.currency });
    };
    onChangeCurrency = (e) => {
        const { input: { value, onChange } } = this.props;
        const currency = e.target.value;
        onChange({ ...value, currency });
    };
    render() {
        const { isRequired, input: { name, value }, meta: { error, warning, touched }, skyPrices } = this.props;
        const showError = !!(touched && (error || warning));
        const skyPrice = skyPrices[value.currency];

        return (
            <FormItem name={name} label={<Label skyPrice={skyPrice} selectedCurrency={value.currency} />} isRequired={isRequired} showError={showError} error={error}>
                <Flex mt={3}>
                    <Button type="button" text='PERCENTAGE ADJUSTMENT' onClick={() => this.setMode(PriceType.PERCENT)} style={fullWidth} primary={value.type === PriceType.PERCENT} />
                    <Button type="button" text='FIXED PRICE' onClick={() => this.setMode(PriceType.FIXED)} style={fullWidth} primary={value.type === PriceType.FIXED} />
                </Flex>
                <Flex mt={3} alignItems='center' >
                    <Box width={3 / 4}>
                        {value.type === PriceType.PERCENT &&
                            <ControlInput type="number" placeholder={'percentage adjustment, e.g. 5'} error={showError} min={0} max={100} step={0.01} value={value.value} onChange={this.onChange} />
                        }
                        {value.type === PriceType.FIXED &&
                            <ControlInput type="number" placeholder={value.currency} error={showError} value={value.value} step={0.01} onChange={this.onChange} />
                        }
                    </Box>
                    <Box ml={'-1px'} width={1 / 4}>
                        <ControlDropdown
                            name="selectedCurrency"
                            options={getCurrencies(skyPrices)}
                            onChange={this.onChangeCurrency}
                            input={{ value: value.currency }}
                            noSelect
                        />
                    </Box>
                </Flex>
                <Box mt={3}>
                    {value.type === PriceType.PERCENT &&
                        <PercentageAdjustmentTip skyPrice={skyPrice} />
                    }
                    {value.type === PriceType.FIXED &&
                        <FixedPriceTip />
                    }
                </Box>
            </FormItem>
        );
    };
};

FormCoinPriceInput.propTypes = {
    input: PropTypes.shape({
        onChange: PropTypes.func.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
    meta: PropTypes.shape({
        touched: PropTypes.bool,
        error: PropTypes.string,
        warning: PropTypes.string,
    }).isRequired,
};

export default FormCoinPriceInput;
