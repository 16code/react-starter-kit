/**
 * 通用权限检查方法
 * Common check permissions method
 * @param { 权限判定 Permission judgment type string |array | Promise | Function } authority
 * @param { 你的权限 Your permission description  type:string} currentAuthority
 * @param { 通过的组件 Passing components } target
 */
const checkPermissions = (authority, currentAuthority, target) => {
    // 没有判定权限.默认查看所有
    // Retirement authority, return target;
    if (!authority) {
        return target;
    }
    // 数组处理
    if (Array.isArray(authority)) {
        if (authority.indexOf(currentAuthority) >= 0) {
            return target;
        }
        return null;
    }

    // string 处理
    if (typeof authority === 'string') {
        if (authority === currentAuthority) {
            return target;
        }
        return null;
    }

    throw new Error('unsupported parameters');
};

export { checkPermissions };
