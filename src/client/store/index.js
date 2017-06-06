import AppReducer from './reducers';

import {applyMiddleware, createStore, compose} from 'redux';

import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const store = createStore(
    AppReducer,
    composeEnhancers(applyMiddleware(promise(), thunk))
);

if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
        store.replaceReducer(AppReducer);
    });
}

export default store;
