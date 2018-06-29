import React from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { Flex, Box } from 'grid-styled';
import moment from 'moment';
import keys from 'lodash/keys';
import values from 'lodash/values';
import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';
import media from 'media';

import theme from 'components/theme';
import Icon, { IconMap } from 'components/layout/Icon';
import { NewMessageCount } from 'components/layout/Badge';
import { TableRow, TableCell } from 'components/layout/Table';
import { TRADE_OPTIONS } from 'constants/index';
import { round } from 'utils';

import DropdownActions from './DropdownActions';

const IconWrapper = styled.span`
    display: none;

    ${media.sm`
        display: inline-block;
    `}
`;

const DoubleCellTitle = styled.div`
    color: ${props => props.theme.colors.blue};
    font-size: 18px;
    line-height: 26px;
    margin-right: ${props => props.theme.space[2]}px;
    display: inline-block;
    
    ${media.sm`
        display: block;
    `}
`;

const DoubleCellBody = styled.div`
    display: inline-block;

    ${media.sm`
        display: block;
    `}
`;

const DoubleCell = ({ title, body }) => (
    <Box>
        <DoubleCellTitle>{title}</DoubleCellTitle>
        <DoubleCellBody>{body}</DoubleCellBody>
    </Box>
);

const LinkedTableRow = withRouter(({ ...props, href, history }) => (<TableRow {...props} onClick={() => history.push(href)} />));

const getFullAddress = advert => `${advert.countryCode}, ${advert.city} ${advert.stateCode || ''} ${advert.postalCode || ''}`;

const getPrice = advert => `${advert.amountFrom} ${advert.amountTo ? `- ${advert.amountTo}` : ''} SKY`;

const getConvertedPrice = advert => {
    let price = 1;
    if (advert.currency === advert.selectedCurrency) {
        if (advert.fixedPrice) {
            price = Number.parseFloat(advert.fixedPrice);
        } else {
            price = Number.parseFloat(advert.price) + (Number.parseFloat(advert.price) * Number.parseFloat(advert.percentageAdjustment) / 100);
        }
    } else {
        const exchangeRate = Number.parseFloat(advert.selectedCurrencyPrice) / Number.parseFloat(advert.price);
        if (advert.fixedPrice) {
            price = Number.parseFloat(advert.fixedPrice) * exchangeRate;
        } else {
            price = Number.parseFloat(advert.selectedCurrencyPrice) + ((Number.parseFloat(advert.price) * Number.parseFloat(advert.percentageAdjustment) / 100) * exchangeRate);
        }
    }
    price = round(price, 2);
    return `${advert.amountFrom * price} ${advert.amountTo ? `- ${advert.amountTo * price}` : ''} ${advert.selectedCurrency}`;
};

const getTradeOptionsText = advert => {
    const advertOptions = pickBy(pick(advert, keys(TRADE_OPTIONS)), item => item);
    return values(pick(TRADE_OPTIONS, keys(advertOptions))).join(', ');
};

export const AdvertRow = ({ data, rowOperations, columns }) => {
    const advert = data;
    let i = data.totalMessagesAmount !== undefined ? 1 : 0;
    return (
        <LinkedTableRow href={`post/${advert.id}`}>
            {data.totalMessagesAmount !== undefined &&
                <TableCell data-label={columns[0].name}>
                    <NewMessageCount newMessages={data.newMessagesAmount} totalMessages={data.totalMessagesAmount} />
                </TableCell>
            }
            <TableCell data-label={columns[i++].name}>
                <DoubleCell title={advert.author} body={getFullAddress(advert)} />
            </TableCell>
            <TableCell data-label={columns[i++].name}>
                <DoubleCell title={getPrice(advert)} body={getConvertedPrice(data)} />
            </TableCell>
            <TableCell data-label={columns[i++].name}>{getTradeOptionsText(advert)}</TableCell>
            <TableCell data-label={columns[i++].name}>
                <Flex justifyContent={'space-between'} width={'100%'} alignItems={'center'}>
                    {moment(advert.expiredAt).format('DD MMMM YY')}
                    {rowOperations
                        ? <DropdownActions advert={advert} operations={rowOperations} />
                        : <IconWrapper><Icon name={IconMap.CaretRight} color={theme.colors.blue} size={'xs'} /></IconWrapper>}
                </Flex>
            </TableCell>
        </LinkedTableRow>
    );
}
