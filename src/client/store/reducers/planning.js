import _ from 'lodash';
import moment from 'moment';

import {
    TEST
} from '../actions/planning/types';

export default function reducer(state = {}, action) {
    switch (action.type) {
    case TEST: {
        const _state = _.cloneDeep(state);
        return _state;
    }
    default:
        return state;
    }
}
