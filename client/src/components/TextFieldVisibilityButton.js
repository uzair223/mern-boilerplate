import React from "react";
import { InputAdornment, IconButton } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

function VisibilityButton(props) {
  const { setVisibility, isVisible } = props;
  const toggle = () => setVisibility(!isVisible);
  return (
    <InputAdornment position="end">
      <IconButton size="small" onClick={toggle}>
        {isVisible ? <Visibility /> : <VisibilityOff />}
      </IconButton>
    </InputAdornment>
  );
}

export default VisibilityButton;
