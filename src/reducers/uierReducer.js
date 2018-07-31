import { createReducer } from 'utils';
const types = {
    toggleTheme: 'ui/toggleTheme',
    toggleSideBarMenu: 'ui/toggleSideBarMenu'
};
const initialState = {
    theme: localStorage.getItem('app-theme') || 'dark',
    sideBarCollapsed: localStorage.getItem('app-sidebar-collapsed') === 'true'
};

export const uiActions = {
    toggleTheme: theme => ({ type: types.toggleTheme, theme }),
    toggleSideBarMenu: collapsed => ({ type: types.toggleSideBarMenu, collapsed })
};

// 切换主题
function toggleTheme(state, action) {
    return Object.assign({}, state, { theme: getChangeTheme(action.theme) });
}
// 切换SideBar是否展开
function toggleSideBarMenu(state, action) {
    localStorage.setItem('app-sidebar-collapsed', action.collapsed);
    return Object.assign({}, state, { sideBarCollapsed: action.collapsed });
}

function getChangeTheme(theme) {
    const changed = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('app-theme', changed);
    return changed;
}

export default createReducer(initialState, {
    [types.toggleTheme]: toggleTheme,
    [types.toggleSideBarMenu]: toggleSideBarMenu
});
