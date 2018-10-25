export const appTheme = localStorage.getItem('app-theme') || 'dark';
export const appSidebarCollapsed = localStorage.getItem('app-sidebar-collapsed') === 'true';

export const ThemeContext = React.createContext({
    appTheme: appTheme,
    appSidebarCollapsed: appSidebarCollapsed
});
