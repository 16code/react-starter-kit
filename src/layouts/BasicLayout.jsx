import { Layout } from 'antd';
import DocumentTitle from 'react-document-title';
import { ContainerQuery } from 'react-container-query';
import { connect } from 'react-redux';
import { enquireScreen, unenquireScreen } from 'utils/enquire';

import { uiActions } from 'reducers/uierReducer';
import { userActions } from 'reducers/auth';

import SiderMenu from 'components/SiderMenu';
import GlobalHeader from 'components/GlobalHeader';
import { getMenuData } from 'common/menuData';
import AuthService from 'services/auth.service';
import logo from 'assets/images/logo.svg';

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
    ({ ui, ajax }) => ({ theme: ui.theme, sideBarCollapsed: ui.sideBarCollapsed, isFetching: ajax.isFetching }),
    {
        ...uiActions,
        userLogout: userActions.userLogout
    }
)
export default class BasicLayout extends React.PureComponent {
    state = {
        isMobile
    };
    constructor() {
        super();
        this.menus = getMenuData();
        this.currentUserRole = AuthService.getAuthority();
    }
    componentDidMount() {
        this.enquireHandler = enquireScreen(mobile => {
            this.setState({
                isMobile: mobile
            });
        });
    }
    componentWillUnmount() {
        unenquireScreen(this.enquireHandler);
    }
    getPageTitle() {
        const { location } = this.props;
        const { pathname } = location;
        const routerData = this.getFlatMenuKeys(this.menus);
        let title = 'Admin';
        if (routerData[pathname] && routerData[pathname].name) {
            title = `${routerData[pathname].name} - Admin`;
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
        const { toggleSideBarMenu } = this.props;
        toggleSideBarMenu(collapsed);
    };
    handleToggleTheme = () => {
        const { theme, toggleTheme } = this.props;
        toggleTheme(theme);
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
        const { theme, location } = this.props;
        return (
            <Layout className="ant-layout-wrapper">
                <SiderMenu
                    logo={logo}
                    theme={theme}
                    location={location}
                    menuData={this.menus}
                    authorizeHelper={AuthService}
                    isMobile={this.state.isMobile}
                    collapsed={this.props.sideBarCollapsed}
                    onCollapse={this.handleToggleCollapse}
                    currentUserRole={this.currentUserRole}
                />
                <Layout>
                    <Header style={{ padding: 0 }}>
                        <GlobalHeader
                            logo={logo}
                            isMobile={this.state.isMobile}
                            collapsed={this.props.sideBarCollapsed}
                            onMenuClick={this.handleMenuClick}
                            onCollapse={this.handleToggleCollapse}
                        />
                    </Header>
                    <Layout>1313131</Layout>
                </Layout>
            </Layout>
        );
    }
    render() {
        return (
            <DocumentTitle title={this.getPageTitle()}>
                <ContainerQuery query={query}>
                    {params => <div className={classNames('layout-wrapper', params)}>{this.layout}</div>}
                </ContainerQuery>
            </DocumentTitle>
        );
    }
}
