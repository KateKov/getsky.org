const id = v => v;

const validateValueExtractor = valueExtractor => {
    if (typeof (valueExtractor) !== 'function') {
        throw Error('valueExtractor is not valid. It must be a function.');
    }
}

export const required = (valueExtractor = id) =>
    value => {
        validateValueExtractor(valueExtractor);
        const extractedValue = value === 0 || value ? valueExtractor(value) : undefined;
        return extractedValue === 0 || extractedValue ? undefined : 'This field is required';
    }

export const min = (min, valueExtractor = id) =>
    value => {
        validateValueExtractor(valueExtractor);

        const extractedValue = valueExtractor(value);
        return extractedValue && extractedValue < min ? `This field must be ${min} or more` : undefined;
    };

export const minLength = (min, valueExtractor = id) =>
    value => {
        validateValueExtractor(valueExtractor);

        const extractedValue = valueExtractor(value);
        return extractedValue && extractedValue.length < min ? `This field must be ${min} characters or more` : undefined;
    };

export const maxLength = (max, valueExtractor = id) =>
    value => {
        validateValueExtractor(valueExtractor);

        const extractedValue = valueExtractor(value);
        return extractedValue && extractedValue.length > max ? `This field must be ${max} characters or less` : undefined;
    };

export const max = (max, valueExtractor = id) =>
    value => {
        validateValueExtractor(valueExtractor);

        const extractedValue = valueExtractor(value);
        return extractedValue && extractedValue > max ? `This field must be ${max} or less` : undefined;
    };

export const alphaNumeric = value =>
    value && /[^a-zA-Z0-9 ]/i.test(value)
        ? 'This field must contain only letters and numbers'
        : undefined;

export const email = value =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,50}$/i.test(value)
        ? 'Invalid email address'
        : undefined;

export const rangedRequired = value => {
    if (value === '' || value === undefined) {
        return 'The field is required';
    }

    if (value.to === undefined || value.mode === 'SINGLE_MODE') {
        return value.from && value.mode === 'SINGLE_MODE' ? undefined : 'The field is required';
    } else {
        return (value.from && value.to) ? undefined : 'The field is required';
    }
};

export const ranged = value =>
    ((value.to === undefined || value.mode === 'SINGLE_MODE') || (value.to >= value.from)) ? undefined : 'First value has to be bigger or same';

export const rangedDecimal = value => {
    if(value.from && value.from.d && value.from.d[0])
    {
        if(value.mode !== 'SINGLE_MODE' && !(value.to && value.to.d && value.to.d[0]))
        {
            return 'Second value is required';
        }

        return (value.to === undefined || value.mode === 'SINGLE_MODE') || (value.to.d[0] >= value.from.d[0]) ? undefined : 'Second value has to be bigger or same'
    }

    return 'First value is required';
}

export const rangedMin = min => value =>
    (value.to === undefined && (value.from < min || value.to < min)) ? `The value can't be less than ${min}` : undefined;

export const rangedMax = max => value =>
    (value.to === undefined && (value.from > max || value.to > max)) ? `The value can't be more than ${max}` : undefined;
