import React from "react";
import { connect } from "react-redux";
import _ from "lodash";
import ConditionalRoute from "./ConditionalRoute";

function PublicOnlyRoute(props) {
  const { auth, component, ...rest } = props;

  return (
    <ConditionalRoute
      component={component}
      condition={_.isEmpty(auth)}
      falseRedirect="/"
      {...rest}
    />
  );
}

const mapStateToProps = state => ({
  auth: state.auth.data,
});
export default connect(mapStateToProps)(PublicOnlyRoute);
