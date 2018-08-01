import { Route, Switch, withRouter } from 'react-router-dom';
import Authorized from 'components/AuthComponent';
import page404 from 'pages/errors/404';
import page403 from 'pages/errors/403';
import BlankLayout from 'layouts/BlankLayout';

const dashboard = asyncComponent(() => import(/* webpackChunkName: "dashboard" */ 'pages/home'));
const list = asyncComponent(() => import(/* webpackChunkName: "list" */ 'pages/list'));

@withRouter
export default class Pages extends React.PureComponent {
    render() {
        const { currentUserRole: role } = this.props;
        return (
            <BlankLayout gutter="16">
                <Switch>
                    <Route userRole={role} path="/dashboard" component={dashboard} exact />
                    <Authorized userRole={role} path="/list" component={list} />
                    <Authorized userRole={role} path="/403" component={page403} />
                    <Route component={page404} />
                </Switch>
            </BlankLayout>
        );
    }
}
