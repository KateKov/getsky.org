import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Flex } from 'grid-styled';
import media from '../../../media';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 75vh;
`;

const Page = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
`;

const NotFoundContent = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 50rem;
  padding: 0 2rem;
  box-sizing: border-box;
`

const MessageContainer = styled(Flex)`
  justify-content: center;
  flex-direction: column;
  position: relative;
  ${media.sm`
    display:  flex-end;
  `}
`;

const NotFoundCode = styled.h2`
  margin: 0 auto;
  padding: 0;
  color:  ${props => props.theme.colors.blue};
  font-family:  ${props => props.theme.fontFamilies.sansBold};
  font-weight: 400;
  line-height: ${props => props.theme.lineHeights[0]};
  margin-bottom: 0;
  font-size: 180px;

  ${media.md`
    font-size: 200px;
  `}
`;

const NotFoundHeading = styled.h1`
  margin: 0 auto;
  padding: 0;
  color: ${props => props.theme.colors.blackAlpha7};
  font-family: ${props => props.theme.fontFamilies.sansBold};
  font-weight: 400;
  line-height: ${props => props.theme.lineHeights[0]};
  margin-bottom: 20px;
  font-size: 46px;

  ${media.md`
    font-size: 48px;
  `}
`;

const NotFoundMessage = styled.p`
  font-size: 20px;
  color: ${props => props.theme.colors.blackAlpha7};
  margin-bottom: 20px;
  font-family:  ${props => props.theme.fontFamilies.sans};
  line-height:${props => props.theme.lineHeights[3]}rem;
  text-transform: none;
  text-align: center;
`;

const NotFoundLink = styled.a`
  color: ${props => props.theme.colors.blue};
  text-decoration: none;
  font-size: 20px;
  text-align: center;
  font-family: ${props => props.theme.fontFamilies.sans};
`

const NotFound = () => (
   <Wrapper> 
     <Helmet><title>Page not found</title></Helmet>
    <Page>
      <NotFoundContent>
          <MessageContainer>
            <NotFoundCode>404</NotFoundCode>
            <NotFoundHeading>Page not found</NotFoundHeading>
            <NotFoundMessage>
              Whoops! Looks like you're lost <br/> 
              This page does not exist anymore or has been moved to a new URL
            </NotFoundMessage>
            <NotFoundLink href="/">Home page</NotFoundLink>
          </MessageContainer>
      </NotFoundContent>
    </Page>
    </Wrapper>
  
);

export default NotFound;
