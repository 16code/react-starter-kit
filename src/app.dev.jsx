import { AppContainer as RootContainer } from 'react-hot-loader';
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
