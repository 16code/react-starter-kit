import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import { Provider } from 'react-redux';
import BasicLayout from 'layouts/BasicLayout';
import { store } from 'store/configureStore.js';
import { zhCN } from 'i18n/zh-CN';

const LoginLayout = asyncComponent(() => import(/* webpackChunkName: "login" */ 'layouts/LoginLayout'));

const Container = () => (
    <Provider store={store}>
        <LocaleProvider locale={zhCN}>
            <BrowserRouter>
                <Switch>
                    <Route path="/login" component={LoginLayout} exact />
                    <Redirect from="/" to="/dashboard" exact />
                    <Route path="/" component={BasicLayout} />
                </Switch>
            </BrowserRouter>
        </LocaleProvider>
    </Provider>
);
export default Container;
