import validator from 'validator';
import _ from 'lodash';

export function isRequired(value) {
    return !validator.isEmpty(_.toString(value)) ? undefined : 'required';
}

export function isTrue(value) {
    return value === true || _.toLower(_.toString(value)) === 'true' ? undefined : "'true' is required";
}

export function isEmail(value) {
    return validator.isEmail(_.toString(value)) ? undefined : 'Email is required';
}

export function equals(valueToCompareWith) {
    return function(value, allValues) {
        return validator.equals(_.toString(value), _.toString(allValues[valueToCompareWith])) ? undefined : 'Is not equal';
    };
}

export function required(value) { return value ? undefined : 'required'; }
