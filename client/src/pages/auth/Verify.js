import React from "react";
import { connect } from "react-redux";
import { Redirect, useParams } from "react-router";
import { authActions } from "redux/reducers/auth";

function Verify(props) {
  const { dispatch, status } = props;
  const { token } = useParams();
  React.useEffect(() => {
    if (token) dispatch(authActions.verify({ url: "auth/register/verify/" + token }));
  }, [dispatch, token]);

  return status === "fulfilled" ? <Redirect to="/login" /> : <Redirect to="/register" />;
}

const mapStateToProps = state => ({ status: state.global.status });
export default connect(mapStateToProps)(Verify);
