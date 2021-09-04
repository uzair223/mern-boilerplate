import React from "react";
import { connect } from "react-redux";
import { authActions } from "redux/reducers/auth";
import { Route, useRouteMatch } from "react-router";
import Switch from "components/router/Switch";

import _ from "lodash";

import { Paper, Typography, TextField, Button, IconButton } from "@material-ui/core";
import VisibilityButton from "components/TextFieldVisibilityButton";
import { useFormik } from "formik";
import * as yup from "yup";

import Notice from "./Notice";
import Verify from "./Verify";
import Shake from "components/ShakeDiv";

const validationSchema = yup.object({
  username: yup
    .string()
    .matches(/^.{6,16}/, "Username must contain between 6 to 16 characters")
    .matches(
      /^([a-zA-Z0-9 _-]+)$/,
      "Username must only contain letters and numbers, underscores and dashes",
    )
    .required("Username is required"),
  name: yup
    .string()
    .max(16, "Name must contain less than 16 characters")
    .matches(/[^a-zA-Z ]/, "Name must only contain letters"),
  email: yup.string().email("Email must be valid").required("Email is required"),
  password: yup
    .string()
    .matches(/^.{8,32}/, "Password must contain between 8 to 32 characters")
    .matches(
      /^.(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[-._!"`'#%&,:;<>=@{}~$()*+/?[\]^|\\])/,
      "Password must contain one uppercase letter, one lowercase letter, one number, and one special character",
    )
    .required("Password is required"),
  password2: yup.string().oneOf([yup.ref("password"), null], "Passwords must match"),
});

function Register(props) {
  const { dispatch, status } = props;
  const { path } = useRouteMatch();
  const [isVisible, setVisibility] = React.useState(false);
  const [isVisible2, setVisibility2] = React.useState(false);
  const [promise, setPromise] = React.useState();

  React.useEffect(() => {
    return () => {
      promise?.abort?.();
    };
  }, [promise]);

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      name: "",
      password: "",
      password2: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setPromise(await dispatch(authActions.register({ data: values })));
      if (promise.error && promise.payload.fields) {
        const errors = _.mapValues(promise.payload.fields, () => true);
        const fields = _.mapValues(promise.payload.fields, () => "");

        resetForm({ values: { ...values, ...fields }, status: { errors }, touched: false });
      }
    },
  });

  return (
    <Shake enabled={status === "rejected"} id="register" className="centered-page">
      <Switch>
        <Route exact path={path}>
          <Paper
            elevation={4}
            className="flex-column-wrapper vertical-center"
            style={{ width: "40%", minHeight: "40%", padding: "3rem" }}>
            <Typography style={{ margin: "1.5rem" }} variant="h3" component="h1">
              Register
            </Typography>

            <form
              className="flex-column-wrapper"
              style={{ width: "100%" }}
              onSubmit={formik.handleSubmit}>
              <div>
                <TextField
                  autoComplete="off"
                  fullWidth
                  margin="dense"
                  id="username"
                  name="username"
                  label="Username *"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  error={formik.touched.username && Boolean(formik.errors.username)}
                  helperText={formik.touched.username && formik.errors.username}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  id="email"
                  name="email"
                  label="Email *"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  id="name"
                  name="name"
                  label="Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  type={isVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  label="Password *"
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
                <TextField
                  fullWidth
                  margin="dense"
                  type={isVisible2 ? "text" : "password"}
                  id="password2"
                  name="password2"
                  label="Confirm password *"
                  value={formik.values.password2}
                  onChange={formik.handleChange}
                  error={
                    formik.status?.valid ||
                    (formik.touched.password && Boolean(formik.errors.password)) ||
                    (formik.touched.password2 && Boolean(formik.errors.password2))
                  }
                  helperText={formik.touched.password2 && formik.errors.password2}
                  InputProps={{
                    endAdornment: (
                      <VisibilityButton isVisible={isVisible2} setVisibility={setVisibility2} />
                    ),
                  }}
                />
              </div>
              <Button
                style={{ margin: "2rem", padding: "0.5rem", width: "50%" }}
                variant="contained"
                color="primary"
                type="submit">
                Register
              </Button>
            </form>

            <div style={{ textAlign: "center" }}>
              <Typography>Or sign up with...</Typography>
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
                Have an account?
              </Typography>
              <Button href="/login">LOGIN</Button>
            </div>
          </Paper>
        </Route>
        <Route path={`${path}/notice`} component={Notice} />
        <Route path={`${path}/verify/:token`} component={Verify} />
      </Switch>
    </Shake>
  );
}

const mapStateToProps = state => ({ status: state.global.status });
export default connect(mapStateToProps)(Register);
