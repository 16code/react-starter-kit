import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Authorized from 'components/AuthComponent';
import page404 from 'pages/errors/404';
import page403 from 'pages/errors/403';

const dashboard = asyncComponent(() => import(/* webpackChunkName: "dashboard" */ 'pages/home'));
const list = asyncComponent(() => import(/* webpackChunkName: "list" */ 'pages/list'));

@withRouter
@connect(({ auth }) => ({ userRole: auth.role, userToken: auth.token }))
export default class Routes extends React.PureComponent {
    render() {
        const { userRole, userToken } = this.props;
        return (
            <Switch>
                <Route path="/dashboard" component={dashboard} exact />
                <Authorized userToken={userToken} userRole={userRole} path="/list" component={list} />
                <Authorized userToken={userToken} userRole={userRole} path="/list/users" component={list} />
                <Authorized userToken={userToken} userRole={userRole} path="/list/products" component={list} />
                <Authorized userToken={userToken} userRole={userRole} path="/403" component={page403} />
                <Route component={page404} />
            </Switch>
        );
    }
}
