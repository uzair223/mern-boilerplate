import React from "react";
import { connect } from "react-redux";
import { authActions } from "redux/reducers/auth";

import { withSize } from "react-sizeme";
import { getCurrBr } from "helpers/theme";

import { Toolbar, IconButton, Typography } from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SettingsIcon from "@material-ui/icons/Settings";

function titleCase(str) {
  return str.toLowerCase().replace(/\b\S/g, t => t.toUpperCase());
}

function Dashboard(props) {
  const { user, dispatch, size } = props;
  const [currBr, setCurrBr] = React.useState();

  React.useEffect(() => {
    setCurrBr(getCurrBr(size.width));
  }, [setCurrBr, size]);

  const btnSize = currBr === "xs" || currBr === "xxs" ? "small" : "medium";

  const handleExitClick = e => {
    e.preventDefault();
    dispatch(authActions.revoke());
  };

  return (
    <div id="dashboard">
      <Toolbar style={{ justifyContent: "space-between" }}>
        <Typography
          style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}
          variant="h3"
          component="h1">
          {titleCase(user.name.split(" ")[0] || user.username)}
        </Typography>

        <IconButton size={btnSize} href="/settings">
          <SettingsIcon />
        </IconButton>

        <IconButton size={btnSize} onClick={handleExitClick}>
          <ExitToAppIcon />
        </IconButton>
      </Toolbar>
    </div>
  );
}
const mapStateToProps = state => ({
  user: state.auth.data.user,
  status: state.global.status,
});

export default connect(mapStateToProps)(withSize({ refreshMode: "debounce" })(Dashboard));
