import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';

import rootReducers from '../reducers';
import rootSagas from '../sagas';

const sagaMiddleware = createSagaMiddleware(rootSagas);
const loggerMiddleware = createLogger({
    collapsed: true,
    timestamp: false,
    level: 'info'
});

const configureStore = (initialState => {
    const store = createStore(
        rootReducers,
        initialState,
        compose(
            applyMiddleware(loggerMiddleware, sagaMiddleware),
            window.devToolsExtension ? window.devToolsExtension() : fn => fn
        )
    );
    sagaMiddleware.run(rootSagas);
    if (module.hot) {
        module.hot.accept('../reducers', () => {
            const nextReducer = require('../reducers').default;
            store.replaceReducer(nextReducer);
        });
    }
    return store;
})();
export { configureStore as store };
