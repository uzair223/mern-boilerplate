import React from "react";
import { connect } from "react-redux";
import { authActions, userActions } from "redux/reducers/auth";
import _ from "lodash";
import ConditionalRoute from "./PublicOnlyRoute";

function PrivateRoute(props) {
  const { dispatch, auth, stack, component, ...rest } = props;

  React.useEffect(() => {
    if (_.isEmpty(auth) && !Object.values(stack)[-1] === ["token/revoke", "fulfilled"]) {
      (async () => {
        const promise = await dispatch(authActions.get());
        if (!promise.error) await dispatch(userActions.get());
      })();
    }
  }, [dispatch, auth, stack]);

  return (
    <ConditionalRoute
      component={!Object.values(stack).includes(["user/get", "pending"]) ? component : () => null}
      condition={!_.isEmpty(auth)}
      falseRedirect="/login"
      {...rest}
    />
  );
}

const mapStateToProps = state => ({
  auth: state.auth.data,
  stack: state.global.stack,
});
export default connect(mapStateToProps)(PrivateRoute);
