import _ from 'lodash';

import {
    SET,
    UPDATE_BALANCE
} from './types';

export function set(user) {
    return {
        type: SET,
        payload: _.omit(user, ['password'])
    }
}

export function updateBalance(balance) {
    return {
        type: UPDATE_BALANCE,
        payload: balance
    }
}