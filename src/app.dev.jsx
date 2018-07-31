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
    exclude: [/^(Adapter|Basic|Connect|MenuItem|Route|Switch|Link|Tooltip|Divider|SubPopupMenu|LazyRenderBox|Menu|Sider|AnimateChild|Dropdown)/i]
});
