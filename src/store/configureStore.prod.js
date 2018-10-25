import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducers from '../reducers';
import rootSagas from '../sagas';

const sagaMiddleware = createSagaMiddleware(rootSagas);
const configureStore = (initialState => {
    const store = createStore(rootReducers, initialState, compose(applyMiddleware(sagaMiddleware)));
    sagaMiddleware.run(rootSagas);
    return store;
})();

export { configureStore as store };
