export const delay = ms =>
    new Promise(res => {
        const timer = setTimeout(() => {
            clearTimeout(timer);
            res();
        }, ms);
    });

export const safeSetState = () => target => {
    target.isTestable = true;
    const setState = target.prototype.setState;
    const componentWillUnmount = target.prototype.componentWillUnmount || function() {};
    target.prototype.setState = function() {
        return setState.apply(this, [...arguments]);
    };
    target.prototype.componentWillUnmount = function() {
        const value = componentWillUnmount.apply(this, [...arguments]);
        this.setState = () => {};
        return value;
    };
};

export { default as pathToRegexp } from 'path-to-regexp';

/**
 * urlToList
 * @param {string} url - location.pathname
 * @example
 * "/form/basic-form" => ["/form", "/form/basic-form"]
 */
export function urlToList(url) {
    const urllist = url.split('/').filter(i => i);
    return urllist.map((urlItem, index) => {
        return `/${urllist.slice(0, index + 1).join('/')}`;
    });
}

export function createReducer(initialState, handlers) {
    return (state = initialState, action) =>
        handlers.hasOwnProperty(action.type) ? handlers[action.type](state, action) : state;
}

/**
 * 字符串加密
 * @param {string} str
 */
export function encrypt(str) {
    let c = String.fromCharCode(str.charCodeAt(0) + str.length);
    for (let i = 1; i < str.length; i++) {
        c += String.fromCharCode(str.charCodeAt(i) + str.charCodeAt(i - 1));
    }
    return c;
}
/**
 * 字符串解密
 * @param {string} str
 */
export function decrypt(str) {
    let c = String.fromCharCode(str.charCodeAt(0) - str.length);
    for (let i = 1; i < str.length; i++) {
        c += String.fromCharCode(str.charCodeAt(i) - c.charCodeAt(i - 1));
    }
    return c;
}

/**
 * 全屏切换
 * @param {string} element
 */
export function toggleFullScreen(el) {
    if (
        !document.fullscreenElement &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement
    ) {
        if (document.documentElement.requestFullscreen) {
            el.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            el.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            el.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            el.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}
