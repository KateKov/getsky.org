import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Flex, Box } from 'grid-styled';
import ControlDropdown from 'components/layout/Form/ControlDropdown';

import theme from 'components/theme';
import { round } from 'utils/';

const Text = styled(Box) `
    font-size: ${theme.fontSizes[0]}px;
    color: ${theme.colors.grayBlue};
`;

const Link = styled.a`
    font-size: ${theme.fontSizes[0]}px;
    color: ${theme.colors.grayBlue};
    text-decoration: underline;
`;

const CurrencySelectorWrapper = styled.div`
    margin-top: -7px;
    select { 
        height: 20px;
        color: #fff;
        margin: 0 5px;
        font-size: 11px;
    }
`;

class SkyPrice extends React.Component {
    changeSelectedCurrency = e => {
        this.props.changeSelectedCurrency(e.target.value);
    }
    render() {
        const { skyPrices, selectedCurrency, } = this.props;

        const currencies = Object.keys(skyPrices).map(c => ({ value: c, text: c }));

        return (
            <Flex>
                <Text>
                    <Link href="https://coinmarketcap.com/currencies/skycoin/"> Latest Skycoin (SKY) price:</Link>
                </Text>
                {skyPrices[selectedCurrency] &&
                    <Text ml={'12px'}>
                        {round(skyPrices[selectedCurrency], 3)}
                    </Text>
                }
                <CurrencySelectorWrapper>
                    <ControlDropdown
                        name="selectedCurrency"
                        options={currencies}
                        onChange={this.changeSelectedCurrency}
                        input={{ value: selectedCurrency }} 
                        bg="#07172e" />
                </CurrencySelectorWrapper>
            </Flex>
        );
    }
}

SkyPrice.propTypes = {
    skyPrices: PropTypes.object.isRequired,
};

export default SkyPrice;
