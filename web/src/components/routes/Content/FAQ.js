import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';

import { getPageTitle } from 'utils';
import theme from '../../theme';
import { H1, H3, P } from 'components/layout/Text';

import TipToggles from './TipToggles';
import TextContainer from './TextContainer';

const MT = '5px';

const Link = styled.a`
    color: ${theme.colors.blue};
`;

export default () => (
    <TextContainer flex='1 0 auto' flexDirection="column" py={5}>
        <Helmet><title>{getPageTitle('FAQ')}</title></Helmet>
        <H1>FAQ</H1>

        <TipToggles label={<H3>Is there a Fee?</H3>} mt={MT}>
            <P>No. BuySKY is FREE of charge.</P>
        </TipToggles>

        <TipToggles label={<H3>Are my transactions private?</H3>} mt={MT}>
            <P>The only details available to the public are what is seen in the advert.</P>
        </TipToggles>

        <TipToggles label={<H3>Can my Sky be stolen if BuySky is hacked?</H3>} mt={MT}>
            <P>Absolutely NOT. No funds are ever held on BuySky. In fact, no funds ever even touch the site. All transactions are between you and the other party. All trading is peer-to-peer.</P>
        </TipToggles>

        <TipToggles label={<H3>Where do I get a Skycoin wallet?</H3>} mt={MT}>
            <P>You can download the official Skycoin wallet here ( <Link href="https://www.skycoin.net/downloads/" target="_blank">https://www.skycoin.net/downloads/</Link>). We recommend you download the Installer version of the wallet for your operating system. Always keep a Backup of your Skycoin wallet and write down your seed for safe keeping.</P>
        </TipToggles>

        <TipToggles label={<H3>Do I have to sell SKY at a fixed price?</H3>} mt={MT}>
            <P>No, but you can if you want to. You can also choose to sell your SKY at the floating exchange rate. If you choose this option, you can specify a percentage you want added to (or subtracted from) the exchange rate price.</P>
        </TipToggles>

        <TipToggles label={<H3>Who provides the exchange rate?</H3>} mt={MT}>
            <P>CoinMarketCap.com</P>
        </TipToggles>

        <TipToggles label={<H3>Do you provide any type of dispute resolution?</H3>} mt={MT}>
            <P>No. Everything is peer to peer.</P>
        </TipToggles>

        <TipToggles label={<H3>Where can I find more information about Skycoin?</H3>} mt={MT}>
            <P>There are many online resources to learn about Skycoin but it's always best to go to the source. Visit Skycoin.net for more information.</P>
        </TipToggles>

        <TipToggles label={<H3>Can I trade other coins?</H3>} mt={MT}>
            <P>No. BuySky was created so the Skycoin community had a place to transact p2p. You can however create an advert and offer your Skycoin for a different digital currency.</P>
        </TipToggles>
    </TextContainer>
);
