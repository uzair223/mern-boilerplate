import React from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";

import { useFormik } from "formik";
import { object, string } from "yup";

import VisibilityButton from "components/TextFieldVisibilityButton";
import Shake from "components/ShakeDiv";

import { connect } from "react-redux";
import { authActions } from "redux/reducers/auth";

import _ from "lodash";
import decodeURLSearchParams from "helpers/decodeURLSearchParams";

const validationSchema = object({
  username: string("Enter your username").required("Username is required"),
  password: string("Enter your password").required("Password is required"),
});

function Login(props) {
  const { dispatch, status } = props;
  const [isVisible, setVisibility] = React.useState(false);
  const [_promise, setPromise] = React.useState();

  React.useEffect(() => {
    return () => {
      _promise?.abort?.();
      setPromise(undefined);
    };
  }, [_promise]);

  React.useEffect(() => {
    // Check for error in url from OAuth redirect
    const params = decodeURLSearchParams(new URLSearchParams(window.location.search));
    if (params?.error) dispatch({ type: "error", error: params.error, meta: { toast: true } });
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      keepSession: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const promise = await dispatch(authActions.login({ data: values }));
      setPromise(promise);
      if (promise.error && promise.payload.fields) {
        const errors = _.mapValues(promise.payload.fields, () => true);
        const fields = _.mapValues(promise.payload.fields, () => "");
        resetForm({ values: { ...values, ...fields }, status: { errors }, touched: false });
      }
    },
  });

  return (
    <Shake enabled={status === "rejected"} id="login" className="centered-page">
      <Paper
        elevation={4}
        style={{ width: "40%", minHeight: "40%", padding: "3rem" }}
        className="flex-column-wrapper vertical-center">
        <Typography style={{ margin: "1.5rem" }} variant="h3" component="h1">
          Login
        </Typography>
        <form
          className="flex-column-wrapper"
          style={{ width: "100%" }}
          onSubmit={formik.handleSubmit}>
          <div>
            <TextField
              fullWidth
              margin="dense"
              id="username"
              name="username"
              label="Username"
              value={formik.values.username}
              onChange={formik.handleChange}
              error={
                formik.status?.errors?.username ||
                (formik.touched.username && Boolean(formik.errors.username))
              }
              helperText={formik.touched.username && formik.errors.username}
            />
            <TextField
              fullWidth
              margin="dense"
              type={isVisible ? "text" : "password"}
              id="password"
              name="password"
              label="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                endAdornment: (
                  <VisibilityButton isVisible={isVisible} setVisibility={setVisibility} />
                ),
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    id="keepSession"
                    name="keepSession"
                    size="small"
                    color="primary"
                    checked={formik.values.keepSession}
                    onChange={formik.handleChange}
                  />
                }
                label={<Typography variant="body2">Remember me</Typography>}
              />
              <Typography align="right" variant="body2">
                <a href="/login/recovery">Forgot password?</a>
              </Typography>
            </div>
          </div>
          <Button
            style={{ margin: "2rem", padding: "0.5rem", width: "50%" }}
            variant="contained"
            color="primary"
            type="submit">
            Login
          </Button>
        </form>

        <div style={{ textAlign: "center" }}>
          <Typography>Or sign in with...</Typography>
          <IconButton href={"http://localhost:9000/auth/google"}>
            <img
              src={`${process.env.PUBLIC_URL + "/assets/Google_Logo.svg"}`}
              style={{ width: 24, height: 24 }}
              alt="Google logo"
            />
          </IconButton>
          <IconButton href={"http://localhost:9000/auth/microsoft"}>
            <img
              src={`${process.env.PUBLIC_URL + "/assets/Microsoft_Logo.svg"}`}
              style={{ width: 24, height: 24 }}
              alt="Microsoft logo"
            />
          </IconButton>
          <Typography style={{ marginTop: "2rem" }} variant="body2">
            Don't have an account?
          </Typography>
          <Button href="/register">SIGN UP</Button>
        </div>
      </Paper>
    </Shake>
  );
}
const mapStateToProps = state => ({ status: state.global.status });
export default connect(mapStateToProps)(Login);
