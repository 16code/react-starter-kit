import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import BasicLayout from 'layouts/BasicLayout';
import { store } from 'store/configureStore.js';

const LoginLayout = asyncComponent(() => import(/* webpackChunkName: "login" */ 'layouts/LoginLayout'));
const TestLayout = asyncComponent(() => import(/* webpackChunkName: "test" */ 'layouts/TestLayout'));

const Container = () => (
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route path="/login" component={LoginLayout} exact />
                <Route path="/test" component={TestLayout} exact />
                <Route path="/" component={BasicLayout} exact />
                {/* <Redirect from="/" to="/dashboard" exact /> */}
                {/* <Route path="/" render={() => <Redirect to="/login" />} /> */}
            </Switch>
        </BrowserRouter>
    </Provider>
);
export default Container;
