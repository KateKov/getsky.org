import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from 'grid-styled';

import { Button } from '../Button';
import { ConfirmModal } from '../Modal';
import { H3 } from '../Text';

const style = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

const Footer = ({ onSubmit }) => (
    <Flex justifyContent={'flex-end'}>
        <Box mr={2}>
            <Button text={'OK'} onClick={onSubmit} primary />
        </Box>
    </Flex>
)

const SuccessConfirm = ({ isOpen, onSubmit, text }) => {
    return (
        <ConfirmModal
            isOpen={isOpen}
            style={style}
            footer={<Footer onSubmit={onSubmit} />}>
            <Box pb={6}>
                <H3>{text}</H3>
            </Box>
        </ConfirmModal>
    );
};

SuccessConfirm.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired
};

export default SuccessConfirm;
