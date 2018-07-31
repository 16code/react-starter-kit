import { encrypt, decrypt } from '../utils/index';
import { checkPermissions } from '../utils/checkPermissions';

const USER_LEVEL_KEY_NAME = 'USER_LEVEL';
const USER_TOKEN_KEY_NAME = 'USER_TOKEN';
const ONLY_CACHED_KEYS = ['token', 'refresh_token', 'role'];

class AuthService {
    url = '/auth/login';
    options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' }
    };
    login = user => {
        return new Promise((resolve, reject) =>
            fetch(this.url, { ...this.options, body: user })
                .then(resolve)
                .catch(reject)
        );
    };
    logout = () => {
        return new Promise(resolve => {
            localStorage.removeItem(USER_TOKEN_KEY_NAME);
            localStorage.removeItem(USER_LEVEL_KEY_NAME);
            resolve();
        });
    };
    refreshToken = () => {
        const { refresh_token: refreshToken } = this.getUser() || {};
        if (!refreshToken) return Promise.reject();
        // return new Promise((resolve, reject) => {
        //     fetch('/refreshToken', { method: 'POST', body: { refresh_token: refreshToken } })
        //         .then(result => {
        //             this.setUser(result).then(resolve);
        //         })
        //         .catch(reject);
        // });
        const options = {
            method: 'POST',
            url: '/api/auth/refreshToken',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(options.method, options.url);
            xhr.onload = () => {
                const result = JSON.parse(xhr.response) || '{}';
                if (xhr.status >= 200 && xhr.status < 300) {
                    this.setUser(result).then(resolve);
                } else {
                    reject(result);
                }
            };
            xhr.onerror = reject;
            if (options.headers) {
                Object.keys(options.headers).forEach(key => {
                    xhr.setRequestHeader(key, options.headers[key]);
                });
            }
            xhr.send(JSON.stringify({ refresh_token: refreshToken }));
        });
    };
    getUser() {
        let parsed;
        try {
            parsed = JSON.parse(localStorage.getItem(USER_TOKEN_KEY_NAME));
            parsed.role = decrypt(parsed.role);
        } catch (error) {
            parsed = null;
        }
        return parsed;
    }
    setUser(user) {
        return new Promise(resolve => {
            const copy = `${user.role}`;
            user.role = encrypt(user.role);
            localStorage.setItem(USER_TOKEN_KEY_NAME, JSON.stringify(user, ONLY_CACHED_KEYS));
            this.setAuthority(copy);
            resolve({ ...user, role: copy });
        });
    }
    getAuthority() {
        const authority = localStorage.getItem(USER_LEVEL_KEY_NAME);
        return (authority && decrypt(authority)) || 'guest';
    }
    setAuthority(authority) {
        return localStorage.setItem(USER_LEVEL_KEY_NAME, encrypt(authority));
    }
    check(roles, curRole, target) {
        return checkPermissions(roles, curRole, target);
    }
}

export default new AuthService();
