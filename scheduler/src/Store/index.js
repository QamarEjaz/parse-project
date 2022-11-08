import { applyMiddleware, compose, createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./reducers";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./sagas";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["AuthRed"],
  blacklist: [],
};

const history = createBrowserHistory();

const persistedReducer = persistReducer(persistConfig, rootReducer(history));
const sagaMiddleware = createSagaMiddleware();
const routeMiddleware = routerMiddleware(history);

const middlewares = [sagaMiddleware, routeMiddleware];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

function configureStore(initialState) {
  const store = createStore(
    persistedReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  );
  sagaMiddleware.run(rootSaga);
  return store;
}

const store = configureStore();

const persistor = persistStore(store);

export { store, persistor, history };
