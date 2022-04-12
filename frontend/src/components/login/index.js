import { React, useState, Fragment, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { Grid, Box, Button } from "@mui/material";
import * as Yup from "yup";
import { makeStyles } from "@mui/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { renderInput } from "../formInput";
import { post } from "../../utils/apiController";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  const [showPassword, SetShowPassword] = useState(false);
  const [loggingIn, SetLoggingIn] = useState(false);
  const [login, SetLogin] = useState(false);
  const [error, SetError] = useState([]);
  const navigate = useNavigate();
  const classes = useStyles();
  const loginSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username Required")
      .matches(/^\s*\S+\s*$/, "White spaces are not allowed"),
    password: Yup.string().required("Password Required"),
  });

  useEffect(() => {
    if (login) {
      let origin = window.location.origin;
      window.location.url = `${origin}/card/lists`;
    }
  }, [error]);

  const handleLogin = async (username, password) => {
    SetLoggingIn(true);
    localStorage.clear();
    let formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    await post(`/login`, formData)
      .then((res) => {
        SetLoggingIn(false);
        localStorage.setItem("access-token", res.data.token);
        localStorage.setItem("username", res.data.user);
        localStorage.setItem("isLogin", true);
        SetLogin(true);
        SetError([]);
      })
      .catch((err) => {
        localStorage.setItem("isLogin", false);
        SetLoggingIn(false);
        SetError(err.response.data);
      });
  };

  const toggleShowPassword = () => {
    SetShowPassword(!showPassword);
  };

  return (
    <Fragment>
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        validationSchema={loginSchema}
        onSubmit={(values, actions) => {
          SetError([]);
          handleLogin(values.username, values.password);
          actions.setSubmitting(false);
        }}
      >
        {(errors, props) => (
          <Form>
            <div className={classes.loginWrapper}>
              <Grid container style={{ justifyContent: "center" }}>
                <Grid
                  item
                  xs={10}
                  sm={8}
                  md={4}
                  style={{
                    background: "rgb(255, 255, 255)",
                    borderRadius: "15px",
                    overflow: "hidden",
                    boxShadow: "0px 6px 10px #00000038",
                  }}
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-evenly"
                    alignItems="left"
                    boxShadow={3}
                    padding="3rem"
                  >
                    <Grid item xs={12} justify="center">
                      <Box display="flex" flexDirection="column">
                        <Field
                          name="username"
                          type="text"
                          className={classes.formControl}
                          label="User Name"
                          component={renderInput}
                        />{" "}
                        <Field
                          name="password"
                          type={showPassword ? "text" : "password"}
                          className={classes.formControl}
                          label="Password"
                          component={renderInput}
                        />
                        <Box className="">
                          {error && error.length > 0 && (
                            <div className={classes.error}>
                              {error[0].message}
                            </div>
                          )}
                        </Box>
                        <Box className={classes.loginButtonWrapper}>
                          <Grid>
                            {/* <Link
                              to="/forgotpassword"
                              style={{
                                fontSize: "12px",
                                color: "#2bbeff",
                                textDecoration: "none",
                              }}
                            >
                              <span
                                style={{
                                  cursor: "pointer",
                                  paddingLeft: "10px",
                                }}
                              >
                                Forgot Password ?
                              </span>
                            </Link> */}
                          </Grid>
                          <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            className="lgn-btn"
                            disabled={loggingIn}
                          >
                            Login
                          </Button>
                        </Box>
                      </Box>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </div>
          </Form>
        )}
      </Formik>
    </Fragment>
  );
};

const useStyles = makeStyles({
  loginWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: " center",
    height: "85vh",
  },
  formControl: {
    margin: "24px 0px !important",
    minWidth: "160",
    display: "block",
    width: "100%",

    "&  .MuiInputBase-root": {
      width: "96%",
      borderRadius: "10px",
    },
  },
  loginButtonWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    margin: "1rem 1rem 0rem 1rem",
    justifyContent: "center",
  },
  error: {
    margin: "10px",
    color: "#e61414",
    fontSize: "12px",
  },
});

export default Login;
