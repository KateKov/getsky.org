import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Flex } from 'grid-styled';
import media from '../../../media';
import { rem } from 'polished';
import notFound from './images/404.svg';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Page = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
`;

const NotFoundContent = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 70rem;
  padding: 0 2rem;
  box-sizing: border-box;
`

const MessageAndImageContainer = styled(Flex)`
  position: relative;

  ${media.sm`
    display:  flex-end;
  `}
  justify-content: center;
`;

const ImageWrapper = styled.div`
  display: none;
  padding-left: 150px;
  max-width: 100%;
  
  ${media.sm`
    display: block;
  `}
`;

const Graphic = styled.img`
  display: block;
  max-width: 100%;
`;

const MessageContainer = styled(Flex)`
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  width: ${rem(280)};

  ${media.sm`
    position: absolute;
    top: -25px;
    left: 0;
  `}
`;

const NotFoundCode = styled.h2`
  margin: 0;
  padding: 0;
  color:  ${props => props.theme.colors.blue};
  font-family:  ${props => props.theme.fontFamilies.sansBold};
  font-weight: 400;
  line-height: ${props => props.theme.lineHeights[0]};
  margin-bottom: 0;
  font-size: 100px;

  ${media.md`
    font-size: 140px;
  `}
`;

const NotFoundHeading = styled.h1`
  margin: 0;
  padding: 0;
  color: ${props => props.theme.colors.blackAlpha7};
  font-family: ${props => props.theme.fontFamilies.sansBold};
  font-weight: 400;
  line-height: ${props => props.theme.lineHeights[0]};
  margin-bottom: 20px;
  font-size: 32px;

  ${media.md`
    font-size: 36px;
  `}
`;

const NotFoundMessage = styled.p`
  font-size: 15px;
  color: ${props => props.theme.colors.blackAlpha7};
  margin-bottom: 20px;
  font-family:  ${props => props.theme.fontFamilies.sans};
  line-height:${props => props.theme.lineHeights[3]}rem;
  text-transform: none;
  text-align: left;
`;

const NotFoundLink = styled.a`
  color: ${props => props.theme.colors.blue};
  text-decoration: none;
  font-family: ${props => props.theme.fontFamilies.sans};
`

const NotFound = () => (
   <Wrapper> 
     <Helmet><title>Page not found</title></Helmet>
    <Page>
      <NotFoundContent>
        <MessageAndImageContainer>
          <MessageContainer>
            <NotFoundCode>404</NotFoundCode>
            <NotFoundHeading>Page not found</NotFoundHeading>
            <NotFoundMessage>
              Whoops! Looks like you're lost <br/> 
              This page does not exist anymore or has been moved to a new URL
            </NotFoundMessage>
            <NotFoundLink href="/">Home page</NotFoundLink>
          </MessageContainer>
          <ImageWrapper>
            <Graphic src={notFound} alt="" />
          </ImageWrapper>
        </MessageAndImageContainer>
      </NotFoundContent>
    </Page>
    </Wrapper>
  
);

export default NotFound;
