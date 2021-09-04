import React from "react";
import { connect } from "react-redux";
import { userActions } from "redux/reducers/auth";

import { Router, Route, Redirect } from "react-router-dom";
import history from "helpers/history";

import Switch from "components/router/Switch";
import PrivateRoute from "components/router/PrivateRoute";
import PublicOnlyRoute from "components/router/PublicOnlyRoute";

import Login from "pages/auth/Login";
import Dashboard from "pages/Dashboard";
import Register from "pages/auth/Register";
import Spinner from "components/Spinner";
import Blurred from "components/BlurredDiv";

import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@material-ui/core";
import theme from "helpers/theme";

function App(props) {
  const { status, dispatch } = props;
  const [param, setParam] = React.useState(
    new URLSearchParams(window.location.search).get("access_token"),
  );

  React.useEffect(() => {
    // Check for access_token in search params (from OAuth redirect)
    if (param)
      (async () => {
        await dispatch({ type: "auth/token/set", payload: param });
        await dispatch(userActions.get());
        setParam(null);
      })();
  }, [dispatch, param]);

  return (
    <>
      <Blurred id="App" blurEnabled={status === "pending"}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <Switch>
              <PublicOnlyRoute path="/login" component={Login} />
              <PublicOnlyRoute path="/register" component={Register} />
              <PrivateRoute path="/dashboard" component={Dashboard} />
              <Route exact path="/">
                {!param && <Redirect exact from="/" to="/dashboard" />}
              </Route>
            </Switch>
          </Router>
        </ThemeProvider>
      </Blurred>
      <ToastContainer position="bottom-right" hideProgressBar />
      <Spinner enabled={status === "pending"} />
    </>
  );
}
const mapStateToProps = state => ({ status: state.global.status });
export default connect(mapStateToProps)(App);
