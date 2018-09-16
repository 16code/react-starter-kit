import { Drawer as DrawerMenu } from 'antd';
import SiderMenu from './SiderMenu';
const drawerMenuWidth = 200;
export default function AppSiderMenu(props) {
    return props.isMobile ? (
        <DrawerMenu
            width={drawerMenuWidth}
            placement="left"
            className="app-drawer-menu"
            closable={false}
            visible={!props.collapsed}
            onClose={() => {
                props.onCollapse(true);
            }}
        >
            <SiderMenu width={drawerMenuWidth} {...props} collapsed={props.isMobile ? false : props.collapsed} />
        </DrawerMenu>
    ) : (
        <SiderMenu {...props} />
    );
}
