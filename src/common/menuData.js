const menuData = [
    {
        name: 'Dashboard',
        icon: 'dashboard',
        path: 'dashboard'
    },
    {
        name: '列表页',
        icon: 'table',
        path: 'list',
        children: [
            {
                name: '用户列表',
                path: 'users',
                role: ['admin', 'guest']
            },
            {
                name: '产品列表',
                path: 'products'
            },
            {
                name: '订单列表',
                path: 'orders'
            }
        ]
    }
];
/* eslint-disable max-len */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

function isUrl(path) {
    return reg.test(path);
}

function formatter(data, parentPath, parentAuthRole) {
    return data.map(item => {
        let { path } = item;
        if (!isUrl(path)) {
            path = parentPath ? parentPath + item.path : item.path;
        }
        const result = {
            ...item,
            path: path.replace(/\/$/, ''),
            authRole: item.role || parentAuthRole
        };
        if (item.children) {
            const parent = item.path === '/' ? '/' : `/${item.path}/`;
            result.children = formatter(item.children, parent, item.role);
        }
        return result;
    });
}
export const getMenuData = () => formatter(menuData);

export function getMenuDataPathKeys(menus) {
    const keys = {};
    function loop(data) {
        data.forEach(item => {
            const { path, authRole, children, name } = item;
            if (children) loop(children);
            keys[path] = {
                authRole: authRole,
                name
            };
        });
    }
    loop(menus);
    return keys;
}
