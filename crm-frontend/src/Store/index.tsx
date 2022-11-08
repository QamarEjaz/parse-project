// import { createStore, applyMiddleware, compose } from "redux";
// import createSagaMiddleware from "redux-saga";
// import thunk from "redux-thunk";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage";
// import { routerMiddleware } from "connected-react-router";
// import rootReducer from "./reducers";
// import { rootSaga } from "./sagas";
// import history from "../utils/history";

// const persistConfig = {
//   key: "Auth",
//   storage: storage,
//   whitelist: ["Auth", "charity"], // which reducer want to store
// };

// const sagaMiddleware = createSagaMiddleware();
// const middleware = [thunk, sagaMiddleware, routerMiddleware(history)];
// const w = window as any;
// const composeEnhancers = w.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const pReducer = persistReducer(persistConfig, rootReducer);
// const store = createStore(
//   pReducer,
//   composeEnhancers(applyMiddleware(...middleware))
// );
// const persistor = persistStore(store);
// sagaMiddleware.run(rootSaga);
// export { persistor, store, history };

import { applyMiddleware, compose, createStore } from "redux"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import rootReducer from "./reducers"
import createSagaMiddleware from "redux-saga"
import { rootSaga } from "./sagas"
import { createBrowserHistory } from "history"
import { routerMiddleware } from "connected-react-router"
const persistConfig = {
  key: "root",
  storage,
  whiteList: ["Auth", "VirtualReducers"],
  blacklist: ["Automation"],
}
const history = createBrowserHistory()
export type AppState = ReturnType<typeof rootReducer>
const persistedReducer = persistReducer(persistConfig, rootReducer(history))
const sagaMiddleware = createSagaMiddleware()
const routeMiddleware = routerMiddleware(history)
const middlewares = [sagaMiddleware, routeMiddleware]
const w: any = window as any
const composeEnhancers = w.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
function configureStore() {
  const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(...middlewares)))
  sagaMiddleware.run(rootSaga)
  return store
}
const store = configureStore()
const persistor = persistStore(store)
export { store, persistor, history }
