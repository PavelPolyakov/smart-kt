import _ from 'lodash';

import {
    SET
} from '../actions/user/types';

export default function reducer(state = {}, action) {
    switch (action.type) {
        case SET: {
            return action.payload;
        }
        default:
            return state;
    }
}
