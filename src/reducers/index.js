import { combineReducers } from 'redux';
import ui from './uierReducer';
import { authReducer } from './auth';
import { ajaxReducer } from './ajax';

export default combineReducers({
    ui,
    auth: authReducer,
    ajax: ajaxReducer
});
