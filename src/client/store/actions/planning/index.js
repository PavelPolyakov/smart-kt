import {
    TEST
} from './types';

export function test() {
    return async function(dispatch) {
        dispatch({type: TEST, payload: {}});
    };
}