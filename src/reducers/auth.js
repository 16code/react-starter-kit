/**
 * 用户登陆, token刷新
 */

import { createReducer } from 'utils/index';
import AuthService from 'services/auth.service';

export const types = {
    userLogin: 'user/login',
    userLogout: 'user/logout',
    userLoginSuccess: 'user/loginSuccess',
    userLoginFailure: 'user/loginFailure',
    authRefreshToken: 'auth/refreshToken',
    authRefreshTokenSuccess: 'auth/refreshTokenSuccess',
    authRefreshTokenFailure: 'auth/refreshTokenFailure',
    clearUserData: 'user/clearUserData'
};

const initialState = {
    ...AuthService.getUser(),
    isRefreshing: false,
    isloading: false,
    error: null
};

// actions
export const userActions = {
    userLogin: (user, rest) => ({
        type: types.userLogin,
        payload: { user, ...rest }
    }),
    userLogout: () => ({ type: types.userLogout })
};

// Reducers
export const authReducer = createReducer(initialState, {
    [types.userLogin]: userLogin,
    [types.userLoginSuccess]: userLoginSuccess,
    [types.userLoginFailure]: userLoginFailure,
    [types.authRefreshToken]: refreshToken,
    [types.authRefreshTokenSuccess]: refreshTokenSuccess,
    [types.authRefreshTokenFailure]: clearUserData,
    [types.clearUserData]: clearUserData
});

function refreshToken(state) {
    return { ...state, isRefreshing: true };
}
function refreshTokenSuccess(state, action) {
    return { ...state, ...action.user, isRefreshing: false };
}
function clearUserData() {
    return { isloading: false, isRefreshing: true, error: null, token: null };
}
function userLogin(state) {
    return { ...state, isloading: true };
}
function userLoginSuccess(state, action) {
    return { ...state, ...action.payload, isloading: false, isRefreshing: false };
}
function userLoginFailure(state, action) {
    return { ...state, error: action.payload, isloading: false };
}
