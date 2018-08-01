import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import BasicLayout from 'layouts/BasicLayout';
import { store } from 'store/configureStore.js';

const LoginLayout = asyncComponent(() => import(/* webpackChunkName: "login" */ 'layouts/LoginLayout'));

const Container = () => (
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route path="/login" component={LoginLayout} exact />
                <Redirect from="/" to="/dashboard" exact />
                <Route path="/" component={BasicLayout} />
            </Switch>
        </BrowserRouter>
    </Provider>
);
export default Container;
