import { Layout, Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import AuthService from 'services/auth.service';
import { pathToRegexp, urlToList } from 'utils/index.js';

const { Sider } = Layout;
const { SubMenu, Item: MenuItem } = Menu;
const getIcon = icon => {
    if (typeof icon === 'string' && icon.indexOf('http') === 0) {
        return <img src={icon} alt="icon" className={'icon sider-menu-item-img'} />;
    }
    if (typeof icon === 'string') {
        return <Icon type={icon} />;
    }
    return icon;
};

const getMeunMatchKeys = (flatMenuKeys = [], path) => {
    return flatMenuKeys.filter(item => {
        return pathToRegexp(item).test(path);
    });
};

const getFlatMenuKeys = (menus = []) => {
    let keys = [];
    menus.forEach(item => {
        if (item.children) {
            keys = keys.concat(getFlatMenuKeys(item.children));
        }
        keys.push(item.path);
    });
    return keys;
};
let flatMenuKeys = [];
export default class SiderMenu extends React.PureComponent {
    constructor(props) {
        super(props);
        this.menus = props.menuData;
        flatMenuKeys = getFlatMenuKeys(this.menus);
        this.state = {
            openKeys: this.constructor.getDefaultCollapsedSubMenus(props)
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.location.pathname !== prevState.pathname) {
            return {
                pathname: nextProps.location.pathname,
                openKeys: SiderMenu.getDefaultCollapsedSubMenus(nextProps)
            };
        }
        return null;
    }

    static getDefaultCollapsedSubMenus(props) {
        const {
            location: { pathname }
        } = props;
        return urlToList(pathname)
            .map(item => getMeunMatchKeys(flatMenuKeys, item)[0])
            .filter(item => item);
    }
    getSelectedMenuKeys = () => {
        const {
            location: { pathname }
        } = this.props;
        return urlToList(pathname).map(itemPath => getMeunMatchKeys(flatMenuKeys, itemPath).pop());
    };
    isMainMenu = key => {
        return this.menus.some(item => key && (item.key === key || item.path === key));
    };
    handleOpenChange = openKeys => {
        const lastOpenKey = openKeys[openKeys.length - 1];
        const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
        this.setState({
            openKeys: moreThanOne ? [lastOpenKey] : [...openKeys]
        });
    };
    getSubMenuOrItem = item => {
        if (item.children && item.children.some(child => child.name)) {
            const childrenItems = this.getNavMenuItems(item.children);
            // 当无子菜单时就不展示菜单
            if (childrenItems && childrenItems.length > 0) {
                return (
                    <SubMenu
                        title={
                            item.icon ? (
                                <span>
                                    {getIcon(item.icon)}
                                    <span>{item.name}</span>
                                </span>
                            ) : (
                                item.name
                            )
                        }
                        key={item.path}
                    >
                        {childrenItems}
                    </SubMenu>
                );
            }
            return null;
        }
        return <MenuItem key={item.path}>{this.getMenuItemPath(item)}</MenuItem>;
    };
    conversionPath = path => {
        if (path && path.indexOf('http') === 0) {
            return path;
        }
        return `/${path || ''}`.replace(/\/+/g, '/');
    };
    getMenuItemPath = item => {
        const itemPath = this.conversionPath(item.path);
        const icon = getIcon(item.icon);
        const { target, name } = item;
        // Is it a http link
        if (/^https?:\/\//.test(itemPath)) {
            return (
                <a href={itemPath} target={target}>
                    {icon}
                    <span>{name}</span>
                </a>
            );
        }
        return (
            <Link
                to={itemPath}
                target={target}
                onClick={
                    this.props.isMobile
                        ? () => {
                            this.props.onCollapse(true);
                        }
                        : undefined
                }
            >
                {icon}
                <span>{name}</span>
            </Link>
        );
    };
    getNavMenuItems = (menusData = []) => {
        return menusData
            .filter(item => item.name && !item.hideInMenu)
            .map(item => {
                const ItemDom = this.getSubMenuOrItem(item);
                return this.checkPermissionItem(item.role, ItemDom);
            })
            .filter(item => item);
    };
    checkPermissionItem = (authRole, ItemDom) => {
        const { userRole } = this.props;
        return AuthService.check(authRole, userRole, ItemDom);
    };
    render() {
        const { collapsed, onCollapse, logo, theme, width } = this.props;
        const { openKeys } = this.state;
        const menuProps = collapsed ? {} : { openKeys };
        let selectedKeys = this.getSelectedMenuKeys();
        if (!selectedKeys.length) {
            selectedKeys = [openKeys[openKeys.length - 1]];
        }
        return (
            <Sider
                width={width}
                theme={theme}
                breakpoint="lg"
                className="app-sider"
                collapsed={collapsed}
                onCollapse={() => onCollapse}
                trigger={null}
                collapsible
            >
                <div className="logo" key="logo">
                    <Link to="/">
                        <img src={logo} alt="logo" />
                        <h1>Demo Admin</h1>
                    </Link>
                </div>
                <Menu
                    key="Menu"
                    theme={theme}
                    mode="inline"
                    {...menuProps}
                    selectedKeys={selectedKeys}
                    onOpenChange={this.handleOpenChange}
                    style={{ padding: '16px 0', width: '100%' }}
                >
                    {this.getNavMenuItems(this.menus)}
                </Menu>
            </Sider>
        );
    }
}
