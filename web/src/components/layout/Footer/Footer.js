import React from 'react';
import styled from 'styled-components';
import { Box } from 'grid-styled';
import { textAlign } from 'styled-system';

import Promo from 'components/layout/Promo';
import Container from 'components/layout/Container';
import Brand from 'components/layout/Brand';
import { Link } from 'components/layout/Links';
import SocialLinks from 'components/layout/SocialLinks';
import media from 'media';

const links = [
    { path: '/', text: 'Home' },
    { path: '/skycoin', text: 'Skycoin' },
    { path: '/search', text: 'Search' },
    { path: '/faq', text: 'FAQ' },
    { path: '/contact-us', text: 'Contact' },
    { path: '/privacy', text: 'Privacy' },
    { path: '/terms', text: 'Terms' },
];

const Background = styled(Box) `
    background: ${props => `linear-gradient(${props.theme.colors.darkBlue}, ${props.theme.colors.black})`};
    margin-top: -200px;
    padding-top: 250px;
`;

const LinksContainer = styled(Container) `
    border-bottom: 1px solid #979797;
    padding-bottom: 50px;
`;

const MicroText = styled(Box) `
    color: ${props => props.theme.colors.grayBlue};
    font-size: ${props => props.theme.fontSizes[1]}px;
    ${textAlign}

    a {
        color: ${props => props.theme.colors.grayBlue};

        &:hover{
            text-decoration: underline;
        }
    }
`;

const LinkWrapper = styled(Box).attrs({
    width: [1 / 2, 1 / 3, 'auto']
}) `
    padding: ${props => props.theme.space[2]}px 0;
    
    &:nth-child(odd) {
        text-align: left;
    }
    &:nth-child(even) {
        text-align: right;
    }
    
    ${media.sm`
        &:nth-child(4) {
            text-align: left;
        }
        &:nth-child(2),
        &:nth-child(5) {
            text-align: center;
        }
        &:nth-child(3),
        &:nth-child(6) {
            text-align: right;
        }    
    `}
    
`;

const DonationSection = styled(Box) `
    background: ${props => props.theme.colors.darkBlue};
`;

const DonationText = styled(Box) `
    color: ${props => props.theme.colors.grayBlue};
    font-size: ${props => props.theme.fontSizes[1]}px;
    margin: 20px 0;
    text-align: center;
    line-height: 20px;
`;

export default () => (
    <Box mt={[10, 12, 14]}>
        <Promo />
        <Background>
            <LinksContainer justifyContent={'space-between'} flexWrap="wrap">
                {links.map((item, i) => (
                    <LinkWrapper key={`footer-link-${i}`}>
                        <Link path={item.path} text={item.text} />
                    </LinkWrapper>
                ))}
            </LinksContainer>
            <Container justifyContent={'center'} my={'76px'}>
                <Brand />
            </Container>
            <Container justifyContent={'space-between'} alignItems={'center'} flexDirection={['column', 'row']} height={'74px'} >
                <MicroText order={1} mt={[2, 4]} textAlign={['center', 'left']} width={[1, 1 / 5]}><a target="_blank" rel="noopener noreferrer" href="https://www.skycoin.net/">Skycoin</a></MicroText>
                <Box order={[3, 2]} mt={[4, 0]} width={[1, 3 / 5]}>
                    <SocialLinks />
                </Box>
                <MicroText order={[2, 3]} mt={[2, 4]} textAlign={['center', 'right']} width={[1, 1 / 5]}>©2018 BuySky.org. All rights reserved.</MicroText>
            </Container>
        </Background>
        <DonationSection>
            <Container justifyContent="center">
                <DonationText>Buysky is fee-free and run entirely on donations. If you feel the team deserves to eat this week buy us lunch! <span role="img" aria-label="wink">&#x1f609;</span>4oooDGxvaQtdaSQBPxGRabWTHg6CGS4kvH</DonationText>
            </Container>
        </DonationSection>
    </Box>
);
