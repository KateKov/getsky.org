import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from 'grid-styled';

import { Button } from 'components/layout/Button';
import { ConfirmModal } from 'components/layout/Modal';
import { H3 } from 'components/layout/Text';

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

const Footer = ({ onClose }) => (
    <Flex justifyContent={'flex-end'}>
        <Box mr={2}>
            <Button text={'OK'} onClick={onClose} primary />
        </Box>
    </Flex>
)

const SuccessConfirm = ({ isOpen, onClose }) => {
    return (
        <ConfirmModal
            isOpen={isOpen}
            style={style}
            footer={<Footer onClose={onClose} />}>
            <Box pb={6}>
                <H3>The information you submitted has been received and we will get back to you shortly.</H3>
            </Box>
        </ConfirmModal>
    );
};

SuccessConfirm.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default SuccessConfirm;
