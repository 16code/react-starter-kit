import { notification } from 'antd';
import { types as authTypes } from 'reducers/auth';
import { types as ajaxTypes } from 'reducers/ajax';
import AuthService from 'services/auth.service';
import { store } from 'store/configureStore';
import fetchIntercept from './fetchIntercept';
const API_GATEWAY = '/api';
const POST_HTTP_METHODS = ['POST', 'DELETED', 'PUT', 'PATCH'];

/**
 * fetch 拦截器 fetch(url, options)
 * @example
 * get 示例 fetch('path/to/url', { param: paramObj })
 * post示例 fetch('path/to/url', { method: 'POST',  body: paramObj })
 */
const pendingRequest = [];

fetchIntercept.register({
    request: function(url, cfg = {}) {
        const baseConfig = {
            method: 'GET',
            credentials: 'same-origin',
            mode: 'cors',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json; charset=utf-8'
            }
        };
        if (!isHttpUrl(url)) {
            url = `${API_GATEWAY}${/^\//.test(url) ? url : `/${url}`}`;
        }
        const config = Object.assign({}, baseConfig, cfg);
        const user = AuthService.getUser();
        if (user && user.token) {
            config.headers.Authorization = user.token;
        }
        const { method, body, headers, params } = config;
        if (POST_HTTP_METHODS.includes(method.toUpperCase()) && body) {
            config.body = headers['Content-Type'].includes('urlencoded')
                ? (config.body = objToUrlParams(body))
                : JSON.stringify(body);
        }
        if (params) {
            url = `${url}?${objToUrlParams(params)}`;
        }
        if (!pendingRequest.length) {
            store.dispatch({ type: ajaxTypes.ajaxRequest });
        }
        pendingRequest.push(url);
        return [url, config];
    },

    requestError: function(error) {
        return Promise.reject(error);
    },

    response: function(response, requestArgs) {
        pendingRequest.shift();
        const status = response.status;
        if (pendingRequest.length === 0) {
            store.dispatch({ type: ajaxTypes.ajaxDone });
        }
        return new Promise((resolve, reject) => {
            switch (true) {
                case status >= 200 && status < 300:
                    resolve(handleResponseOk(response));
                    break;
                case status === 401:
                    handleRefreshToken(requestArgs, resolve, reject);
                    break;
                default:
                    handleResponseError(response, requestArgs)
                        .then(reject)
                        .catch(reject);
                    break;
            }
        });
    },

    responseError: function(error) {
        // Handle an fetch error
        return Promise.reject(error);
    }
});

function handleWatchState(requestArgs, resolve, reject) {
    const unSubscribe = store.subscribe(() => {
        if (!store.getState().auth.isRefreshing) {
            unSubscribe();
            fetch(...requestArgs)
                .then(resolve)
                .catch(reject);
        }
    });
}
function handleRefreshToken(requestArgs, resolve, reject) {
    const {
        auth: { isRefreshing }
    } = store.getState();
    if (isRefreshing) {
        handleWatchState(requestArgs, resolve, reject);
    } else {
        store.dispatch({ type: authTypes.authRefreshToken });
        AuthService.refreshToken()
            .then(res => {
                store.dispatch({ type: authTypes.authRefreshTokenSuccess, user: res });
                fetch(...requestArgs)
                    .then(resolve)
                    .catch(reject);
            })
            .catch(err => {
                reject(err);
                store.dispatch({ type: authTypes.authRefreshTokenFailure });
            });
    }
}

function handleResponseOk(response) {
    return handleResponseData(response)
        .then(res => res)
        .catch(errs => errs);
}

function handleResponseError(response, requestArgs) {
    return response
        .json()
        .then(json => handleErrorData({ response, json, requestArgs }))
        .catch(() => handleErrorData({ response, requestArgs }));
}
function handleResponseData(response) {
    const contentType = response.headers.get('content-type');

    if (!contentType) {
        return response.text();
    }

    if (contentType.includes('application/json')) {
        return response.json();
    }
    return response.blob();
}

function handleErrorData({ response, json, requestArgs }) {
    const { url, status, statusText } = response;
    const errorInfo = {
        apiInfo: { url, requestArgs, status, statusText },
        pageInfo: {
            origin: window.location.origin,
            pathname: window.location.pathname,
            title: document.title
        },
        status,
        statusText,
        msg: null
    };
    if (response.status >= 500) {
        errorInfo.msg = response.statusText;
    } else if (json) {
        if (Array.isArray(json)) {
            json.forEach(err => {
                errorInfo.msg = err.error_description;
            });
        } else {
            errorInfo.msg = json.error_description;
        }
    }
    notification.error({
        message: `${errorInfo.status} ${errorInfo.statusText}`,
        description: errorInfo.msg,
        duration: 4
    });
    return errorInfo;
}

function objToUrlParams(obj) {
    const keys = Object.keys(obj).filter(key => !!obj[key]);
    const data = keys.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
    return data.join('&');
}
function isHttpUrl(url) {
    const urlRegex = /^http(s)?|^\/\//;
    return urlRegex.test(url);
}
