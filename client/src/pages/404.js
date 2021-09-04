import React from "react";
import { Paper, Typography } from "@material-ui/core";
import { useLocation } from "react-router";

function PageNotFound(props) {
  const location = useLocation();
  return (
    <div id="404-not-found" className="centered-page">
      <Paper
        elevation={4}
        className="absolute-center centered-page-card"
        style={{ width: "40%", minHeight: "40%", padding: "3rem", textAlign: "center" }}>
        <Typography variant="h3" component="h1" paragraph={true}>
          Error 404
        </Typography>
        <Typography variant="h5" paragraph={true}>
          No match for <code>{location.pathname}</code>
        </Typography>
      </Paper>
    </div>
  );
}

export default PageNotFound;
