import AppContainer from './containers/AppContainer';

const rootElement = document.getElementById('root');
const render = Component => {
    ReactDOM.render(
        <div className="container-wrapper">
            <Component />
        </div>,
        rootElement
    );
};
render(AppContainer);
