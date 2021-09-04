import React from "react";
import { Switch as RootSwitch, Route } from "react-router-dom";
import PageNotFound from "pages/404";

function Switch({ children }) {
  return (
    <RootSwitch>
      {children}
      <Route pathname="**" component={PageNotFound} />
    </RootSwitch>
  );
}

export default Switch;
