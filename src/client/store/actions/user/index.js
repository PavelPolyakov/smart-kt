import _ from 'lodash';

import {
    SET
} from './types';

export function set(user) {
    return {
        type: SET,
        payload: _.omit(user, ['password'])
    }
}