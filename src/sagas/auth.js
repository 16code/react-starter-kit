import { all, call, put, takeLatest } from 'redux-saga/effects';
import { types } from 'reducers/auth';
import AuthService from 'services/auth.service';

function* userLogin({ payload }) {
    const { user, location, history } = payload;
    try {
        const response = yield call(AuthService.login, user);
        /* eslint-disable camelcase */
        const { token, refresh_token, role } = response;
        const loggedInUser = {
            token,
            refresh_token,
            role: role.toLowerCase()
        };
        yield put({
            type: types.userLoginSuccess,
            payload: loggedInUser
        });
        yield AuthService.setUser(loggedInUser);
        const { state } = location || {};
        if (history && (state && state.from)) {
            const toPathName = state.from.pathname || '/';
            history.push({ pathname: toPathName });
            // window.location.href = toPathName;
        } else {
            window.location.href = '/';
        }
    } catch (error) {
        yield put({ type: types.userLoginFailure, payload: error });
    }
}

function* userLogout() {
    try {
        yield call(AuthService.logout);
        yield put({ type: types.clearUserData });
    } catch (error) {
        yield put({ type: types.clearUserData });
    }
}

export function* authSaga() {
    yield all([takeLatest(types.userLogin, userLogin), takeLatest(types.userLogout, userLogout)]);
}
