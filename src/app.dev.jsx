import { AppContainer as RootContainer } from 'react-hot-loader';
import { whyDidYouUpdate } from 'why-did-you-update';
import AppContainer from './containers/AppContainer';

const rootElement = document.getElementById('root');
const render = Component => {
    ReactDOM.render(
        <RootContainer warnings={false}>
            <div className="container-wrapper">
                <Component />
            </div>
        </RootContainer>,
        rootElement
    );
};
render(AppContainer);
module.hot.accept('./containers/AppContainer', () => render(AppContainer));

/* eslint-disable max-len */
whyDidYouUpdate(React, {
    groupByComponent: true,
    exclude: [
        /^Connect/i,
        /^(Route|Switch|Link)/i, // for router
        /^(Tooltip|Divider|SubPopupMenu|LazyRenderBox|Menu|Sider|AnimateChild|Dropdown|PopupInner|DOMWrap|Adapter|Basic|MenuItem|SubMenu)/i, // for antd
        /^(Table|Radio|LocaleReceiver|ExpandableRow|Pagination|Options|MiniSelect|Select)/i
    ]
});
