import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import thunk from "redux-thunk";
import debounce from "./middleware/debounce";
import throttle from "./middleware/throttle";
import toast from "./middleware/toast";

import { authActions } from "./reducers/auth";
import { AxiosInterceptors } from "helpers/axios";
import rootReducer from "./reducers";

const middleware = [thunk, debounce(), throttle(), toast];

if (process.env.NODE_ENV !== "production") {
  const { createLogger } = require("redux-logger");
  const logger = createLogger({
    collapsed: (getState, action, logEntry) => !logEntry.error,
    predicate: (getState, action) => action.type !== "grid/setlayouts",
  });
  middleware.push(logger);
}

const middlewareEnhancer = applyMiddleware(...middleware);
const enhancers = [middlewareEnhancer];

const store = createStore(rootReducer, composeWithDevTools(...enhancers));

AxiosInterceptors.setup(store, authActions);

export default store;
