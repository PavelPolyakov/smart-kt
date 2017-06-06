import {combineReducers} from 'redux';
import { reducer as formReducer } from 'redux-form'

import user from './user';
import planning from './planning';

export default combineReducers({
    form: formReducer,
    user,
    planning
});
