import React from "react";
import { Redirect, Route } from "react-router-dom";

function ConditionalRoute(props) {
  const { condition, falseRedirect, component: Component, ...rest } = props;

  return (
    <Route
      {...rest}
      render={props => (condition ? <Component {...props} /> : <Redirect to={falseRedirect} />)}
    />
  );
}

export default ConditionalRoute;
