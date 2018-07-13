import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux'
import styled from 'styled-components';
import BaseButton from './BaseButton';

const Button = styled(BaseButton) `
    background: ${props => props.theme.colors.darkBlue};
    color: ${props => props.theme.colors.white};
    border-color: ${props => props.theme.colors.darkBlue};
    font-family: ${props => props.theme.fontLight};

    &:hover {
        background: ${props => props.theme.colors.grayBlue};
        border-color: ${props => props.theme.colors.grayBlue};
    }
`;

const SearchButton = ({ push, text, className,  style, primary, ...rest }) => (
    <Button
        className={className}
        onClick={() => push('/search')}
        primary={primary}
        style={style}
        {...rest}
    >        
    {text}
    </Button>
);

SearchButton.defaultProps = {
    text: 'Search for adverts',
};

SearchButton.propTypes = {
    push: PropTypes.func.isRequired,
    text: PropTypes.string,
    className: PropTypes.string,
    primary: PropTypes.bool,
};

export default connect(null, { push })(SearchButton);
