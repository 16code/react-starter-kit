import { combineReducers } from 'redux';
import { authReducer } from './auth';
import { ajaxReducer } from './ajax';

export default combineReducers({
    auth: authReducer,
    ajax: ajaxReducer
});
