import _ from 'lodash';

import {
    SET,
    UPDATE_BALANCE
} from '../actions/user/types';

export default function reducer(state = {
    username: undefined,
    wallet: { address: undefined, balance: { ETH: undefined, EUR: undefined } }
}, action) {
    switch (action.type) {
        case SET: {
            return action.payload;
        }
        case UPDATE_BALANCE: {
            const _state = _.cloneDeep(state);
            _state.wallet.balance = action.payload;
            return _state;
        }
        default:
            return state;
    }
}
