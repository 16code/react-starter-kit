import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { getMenuData, getMenuDataPathKeys } from 'common/menuData';

const menuData = getMenuData();
const menuDataPathKeys = getMenuDataPathKeys(menuData);
const loginPage = props => (
    <Redirect
        to={{
            pathname: '/login',
            state: {
                from: props.location,
                message: 'You need to sign in'
            }
        }}
    />
);
const prmissionDeniedePage = props => (
    <Redirect
        to={{
            pathname: '/403',
            state: {
                from: props.location,
                message: '无权限进入'
            }
        }}
    />
);
const Authorized = ({ component: ComposedComponent, ...rest }) => {
    class AuthComponent extends React.PureComponent {
        componentRender = props => {
            const { userRole, userToken } = rest;
            if (userToken) {
                const { authRole } = menuDataPathKeys[props.location.pathname] || {};
                if (authRole && userRole && !~authRole.indexOf(userRole)) {
                    return prmissionDeniedePage(props);
                }
                return <ComposedComponent {...props} />;
            }
            return loginPage(props);
        };

        render() {
            return <Route render={this.componentRender} />;
        }
    }
    return <AuthComponent />;
};
Authorized.propTypes = {
    component: PropTypes.func
};
export default Authorized;
