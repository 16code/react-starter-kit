import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
const AuthorizedRoute = ({ component: ComposedComponent, ...rest }) => {
    @connect(({ auth }) => ({ token: auth.token }))
    class AuthComponent extends React.PureComponent {
        componentRender = props => {
            const { location } = props;
            const { userRole } = rest;
            if (this.props.token) {
                const { authRole } = menuDataPathKeys[location.pathname] || {};
                if (authRole && userRole && !~authRole.indexOf(userRole)) {
                    return prmissionDeniedePage(props);
                }
                return <ComposedComponent {...props} />;
            }
            return loginPage(props);
        };

        render() {
            return <Route {...rest} render={this.componentRender} />;
        }
    }
    return <AuthComponent />;
};
AuthorizedRoute.propTypes = {
    component: PropTypes.func
};
export default AuthorizedRoute;
