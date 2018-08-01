import { Icon, Menu, Dropdown, Avatar, Tooltip, Divider } from 'antd';
import { Link } from 'react-router-dom';
import styles from './index.less';

const MenuItem = Menu.Item;
const MenuDivider = Menu.Divider;
const selectedKeys = [];

function HeaderMenu({ onMenuClick }) {
    const menu = (
        <Menu onClick={onMenuClick} className={styles['dropdown-menu']} selectedKeys={selectedKeys}>
            <MenuItem disabled>
                <Icon type="user" />个人中心
            </MenuItem>
            <MenuItem disabled>
                <Icon type="setting" />设置
            </MenuItem>
            <MenuItem key="changeTheme">
                <Icon type="setting" />切换主题
            </MenuItem>
            <MenuDivider />
            <MenuItem key="logout">
                <Icon type="logout" />退出登录
            </MenuItem>
        </Menu>
    );
    return (
        <Dropdown overlay={menu} trigger={['click']}>
            <span className={`${styles.action} ${styles.account}`}>
                <Avatar size="small" icon="user" src={require('assets/images/avatar.png')} className={styles.avatar} />
                <span className={styles.name}>Hello, Jerry</span>
            </span>
        </Dropdown>
    );
}

export default function GlobalHeader({ logo, isMobile, collapsed, onCollapse, onMenuClick }) {
    return (
        <div className={styles['app-header']}>
            {isMobile && (
                <f>
                    <Link to="/" className={styles.logo} key="logo">
                        <img src={logo} alt="logo" width="32" />
                    </Link>
                    <Divider type="vertical" key="line" />
                </f>
            )}
            <Icon
                className={styles.trigger}
                type={collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={() => onCollapse()}
            />
            <div className={styles.right}>
                <Tooltip title="使用文档">
                    <a target="_blank" href="#" rel="noopener noreferrer" className={styles.action}>
                        <Icon type="question-circle-o" />
                    </a>
                </Tooltip>
                <HeaderMenu onMenuClick={onMenuClick} />
            </div>
        </div>
    );
}
