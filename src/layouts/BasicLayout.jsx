import { Layout } from 'antd';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import { ContainerQuery } from 'react-container-query';
import { enquireScreen, unenquireScreen } from 'utils/enquire';

import { userActions } from 'reducers/auth';

import SiderMenu from 'components/SiderMenu';
import GlobalHeader from 'components/GlobalHeader';
import { getMenuData } from 'common/menuData';
import logo from 'assets/images/logo.svg';
import { ThemeContext, appTheme, appSidebarCollapsed } from 'containers/themeContext';
import Pages from 'pages/index';

const ThemeProvider = ThemeContext.Provider;
const ThemeConsumer = ThemeContext.Consumer;
const { Header } = Layout;
let isMobile;
enquireScreen(b => {
    isMobile = b;
});
const query = {
    'screen-xs': {
        maxWidth: 575
    },
    'screen-sm': {
        minWidth: 576,
        maxWidth: 767
    },
    'screen-md': {
        minWidth: 768,
        maxWidth: 991
    },
    'screen-lg': {
        minWidth: 992,
        maxWidth: 1199
    },
    'screen-xl': {
        minWidth: 1200
    }
};
@connect(
    ({ ajax, auth }) => ({ isFetching: ajax.isFetching, userRole: auth.role }),
    { userLogout: userActions.userLogout }
)
export default class BasicLayout extends React.PureComponent {
    state = {
        isMobile,
        appTheme: appTheme,
        appSidebarCollapsed: appSidebarCollapsed
    };
    constructor() {
        super();
        this.menus = getMenuData();
    }
    componentDidMount() {
        this.enquireHandler = enquireScreen(mobile => {
            this.setState({ isMobile: mobile });
        });
    }
    componentWillUnmount() {
        unenquireScreen(this.enquireHandler);
    }
    getPageTitle() {
        const { location } = this.props;
        const { pathname } = location;
        const routerData = this.getFlatMenuKeys(this.menus);
        let title = APP_NAME;
        if (routerData[pathname] && routerData[pathname].name) {
            title = `${routerData[pathname].name} - ${APP_NAME}`;
        }
        return title;
    }
    getFlatMenuKeys(menus) {
        let keys = {};
        menus.forEach(item => {
            if (item.children) {
                keys = Object.assign(keys, this.getFlatMenuKeys(item.children));
            }
            keys[item.path] = {
                name: item.name
            };
        });
        return keys;
    }
    handleToggleCollapse = collapsed => {
        this.setState(
            state => ({
                appSidebarCollapsed: typeof collapsed === 'undefined' ? !state.appSidebarCollapsed : collapsed
            }),
            () => {
                localStorage.setItem('app-sidebar-collapsed', this.state.appSidebarCollapsed);
            }
        );
    };
    handleToggleTheme = () => {
        this.setState(
            state => ({
                appTheme: state.appTheme === 'light' ? 'dark' : 'light'
            }),
            () => localStorage.setItem('app-theme', this.state.appTheme)
        );
    };
    handleLogout = () => {
        this.props.userLogout();
    };
    handleMenuClick = ({ key }) => {
        switch (key) {
            case 'changeTheme':
                this.handleToggleTheme();
                break;
            case 'logout':
                this.handleLogout();
                break;
            default:
                break;
        }
    };
    get layout() {
        const { location, userRole } = this.props;
        return (
            <ThemeConsumer>
                {({ appTheme, appSidebarCollapsed }) => (
                    <Layout className="ant-layout-wrapper">
                        <SiderMenu
                            logo={logo}
                            theme={appTheme}
                            location={location}
                            menuData={this.menus}
                            isMobile={this.state.isMobile}
                            collapsed={appSidebarCollapsed}
                            onCollapse={this.handleToggleCollapse}
                            userRole={userRole}
                        />
                        <Layout>
                            <Header style={{ padding: 0 }}>
                                <GlobalHeader
                                    logo={logo}
                                    isMobile={this.state.isMobile}
                                    collapsed={appSidebarCollapsed}
                                    onMenuClick={this.handleMenuClick}
                                    onCollapse={this.handleToggleCollapse}
                                />
                            </Header>
                            <Layout>
                                <Pages />
                            </Layout>
                        </Layout>
                    </Layout>
                )}
            </ThemeConsumer>
        );
    }
    render() {
        const { appTheme, appSidebarCollapsed } = this.state;
        return (
            <ThemeProvider value={{ appTheme, appSidebarCollapsed }}>
                <DocumentTitle title={this.getPageTitle()}>
                    <ContainerQuery query={query}>
                        {params => <div className={classNames('layout-wrapper', params)}>{this.layout}</div>}
                    </ContainerQuery>
                </DocumentTitle>
            </ThemeProvider>
        );
    }
}
