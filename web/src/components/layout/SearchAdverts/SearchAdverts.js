import React from 'react'
import styled from 'styled-components';
import { Flex, Box } from 'grid-styled';
import { SearchButton } from 'components/layout/Button';

const SearchBtn = styled(SearchButton) `
    height: 70px;
    font-size: 18px;
    line-height: 18px;
`;

export default () => (
        <Flex justifyContent={'center'} flexWrap="wrap" flexDirection={['column', 'row']}>
                <Box mx={3} mt={60}>
                    <SearchBtn text={'Search the adverts'} width={[1, '280px']} />
                </Box>
        </Flex>
);
