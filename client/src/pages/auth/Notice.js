import React from "react";
import { Paper, Typography, Button } from "@material-ui/core";

function Notice(props) {
  return (
    <div id="register-notice" className="centered-page">
      <Paper
        elevation={4}
        className="absolute-center centered-page-card"
        style={{ width: "40%", minHeight: "40%", padding: "3rem", textAlign: "center" }}>
        <Typography variant="h4" component="h1" paragraph={true}>
          Account created successfully!
        </Typography>
        <Typography variant="h5" paragraph={true}>
          Check your emails to activate your account
        </Typography>
        <Typography>Couldn't find it?</Typography>
        <Button href="http://localhost:9000/auth/register/resend">Resend email</Button>
      </Paper>
    </div>
  );
}

export default Notice;
