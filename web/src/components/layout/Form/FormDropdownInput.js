import React from 'react';
import { Flex, Box } from 'grid-styled';
import PropTypes from 'prop-types';

import ControlDropdown from './ControlDropdown';
import ControlInput from './ControlInput';
import FormItem from './FormItem';

const inputStyle = { borderRight: 0 };

class FormDropdownInput extends React.Component {
    onChangeText = e => {
        const { input: { onChange, value } } = this.props;
        onChange({ ...value, data: e.target.value });
    }

    onChangeDropdownValue = e => {
        const { input: { onChange, value } } = this.props;
        onChange({ ...value, prefix: e.target.value });
    }

    render() {
        const { label, type, min, max, step, description, isRequired, options, defaultUnits, input: { name, value }, meta: { error, warning, touched } } = this.props;
        const showError = !!(touched && (error || warning));
        const unit = defaultUnits ? defaultUnits : '';
        return (
            <FormItem name={name} label={label} isRequired={isRequired} description={description} showError={showError} error={error}>
                <Flex>
                    <Box width={3 / 4}>
                        <ControlInput name={`${name}_input_text`} type={type} min={min} max={max} step={step} value={value ? value.data : ''} placeholder={'Distance'} onChange={this.onChangeText} style={inputStyle} error={showError} />
                    </Box>
                    <Box width={1 / 4}>
                        <ControlDropdown
                            name={`${name}_input_options`}
                            options={options}
                            value={value ? value.prefix : ''}
                            input={{ value: value ? value.prefix : unit }}
                            onChange={this.onChangeDropdownValue}
                            error={showError} />
                    </Box>
                </Flex>
            </FormItem>
        );
    }
}

FormDropdownInput.propTypes = {
    input: PropTypes.shape({
        onChange: PropTypes.func.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
    meta: PropTypes.shape({
        touched: PropTypes.bool,
        error: PropTypes.string,
        warning: PropTypes.string,
    }).isRequired,
    label: PropTypes.string,
    description: PropTypes.string,
    isRequired: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.any.isRequired,
        text: PropTypes.string.isRequired,
    })),
    min: PropTypes.number,
    max: PropTypes.number,
    type: PropTypes.string,
};

export default FormDropdownInput;
