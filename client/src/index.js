import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "redux/store";

import App from "App";

import "css/index.css";
import "react-toastify/dist/ReactToastify.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root"),
);
