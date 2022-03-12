import React, { Fragment, useState, useEffect } from "react";
import { Paper, Button, Grid, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import "yup-phone";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { renderImageUpload, renderPhone, renderInput } from "../formInput";
import Loader from "../loader";

const validations = Yup.object().shape({
  name: Yup.string().required("Name required"),
  designation: Yup.string().required("Designation required"),
  email: Yup.string()
    .required("Email  required")
    .email("Enter a valid email address"),
  phone: Yup.string()
    .required("Phone required ")
    .phone("", "", "Enter a valid phone number"),
  whatsapp: Yup.string()
    .required("Whatsapp number required ")
    .phone("", "", "Enter a valid phone number"),
  qualification: Yup.string().required("Qualification  required"),
  linkedin: Yup.string().required("Linkedin id required"),
});

const Home = (props) => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] = useState(null);
  const navigate = useNavigate();
  const [idError, setIdError] = useState([]);
  const [image, setImage] = useState("");

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleSubmit = async (values, actions) => {
    let formData = new FormData();
    formData.append("name", values.name);
    formData.append("designation", values.designation);
    formData.append("email", values.email);
    formData.append("whatsapp", values.whatsapp);
    formData.append("phone", values.phone);
    formData.append("qualification", values.qualification);
    formData.append("linkedin", values.linkedin);
    formData.append("file", values.profileImage);
    await axios
      .post("http://localhost:5000/", formData)
      .then((res) => {
        console.log(res.data.name);
        navigate(`/${res.data.name}`);
      })
      .catch((error) => {
        const errorMesssage = error.response.data[0].message;
        errorMesssage.includes("User") &&
          actions.setFieldError("name", errorMesssage);
        errorMesssage.includes("Email") &&
          actions.setFieldError("email", errorMesssage);
        errorMesssage.includes("Phone") &&
          actions.setFieldError("phone", errorMesssage);
        errorMesssage.includes("whatsapp") &&
          actions.setFieldError("whatsapp", errorMesssage);
        errorMesssage.includes("Linkedin") &&
          actions.setFieldError("linkedin", errorMesssage);
        setIdError(error.data.detail);
      });
  };
  const handleReset = (values, actions) => {};

  const readURL = (input) => {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        setImage(e.target.result);
      };

      reader.readAsDataURL(input.files[0]);
    }
  };

  useEffect(() => {
    setInitialValues({
      name: "",
      designation: "",
      phone: "",
      whatsapp: "",
      qualification: "",
      email: "",
      linkedin: "",
    });
  }, []);

  return (
    <Fragment>
      {isLoading ? (
        <Loader />
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validations}
          validateOnChange={true}
          validateOnBlur={true}
          enableReinitialize
          onSubmit={(values, actions) => {
            setIdError([]);
            handleSubmit(values, actions);
            actions.setSubmitting(true);
          }}
        >
          {(props) => (
            <Form>
              <Box className={classes.form}>
                <Paper elivation={12} className="formWrapper">
                  <div className={classes.headWrapper}>
                    <Box
                      display={{ xs: "block", sm: "flex" }}
                      justifyContent={{
                        xs: "space-between",
                        md: "space-between",
                      }}
                      style={{ marginBottom: "10px" }}
                    >
                      <Grid container spacing={2}>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={6}
                          lg={6}
                          className={classes.textWrapper}
                        >
                          <Field
                            name="name"
                            type="text"
                            className={classes.formControl}
                            label="Name"
                            component={renderInput}
                          />
                          <Field
                            name="designation"
                            type="text"
                            className={classes.formControl}
                            label="Designation"
                            component={renderInput}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={6}
                          lg={6}
                          className={classes.imageWrapper}
                        >
                          <Field
                            name="profileImage"
                            id="profileImage"
                            className={classes.formControl}
                            inputClass={classes.hiddenInput}
                            component={renderImageUpload}
                            readURL={readURL}
                            selectedImage={image}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                          <Field
                            name="whatsapp"
                            type="text"
                            className={classes.formControlPhone}
                            label="Whatsapp"
                            component={renderPhone}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                          <Field
                            name="phone"
                            type="text"
                            className={classes.formControlPhone}
                            label="Phone"
                            component={renderPhone}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                          <Field
                            name="email"
                            type="text"
                            className={classes.formControl}
                            label="Email"
                            component={renderInput}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                          <Field
                            name="linkedin"
                            type="text"
                            className={classes.formControl}
                            label="Linkedin ID"
                            component={renderInput}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                          <Field
                            name="qualification"
                            type="text"
                            className={classes.formControl}
                            label="Qualificaion"
                            component={renderInput}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                          {idError && idError.length > 0 && (
                            <div className={classes.error}>
                              {idError[0].message}
                            </div>
                          )}
                        </Grid>
                      </Grid>
                    </Box>
                  </div>
                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    className="submit-inner"
                  >
                    <Button variant="outlined">Cancel</Button>
                    <Button
                      variant="contained"
                      className="submit-button"
                      type="submit"
                    >
                      Submit
                    </Button>
                  </Box>
                </Paper>
              </Box>
            </Form>
          )}
        </Formik>
      )}
    </Fragment>
  );
};

const useStyles = makeStyles({
  root: {
    "& > *": {
      margin: "16px",
    },
  },
  headWrapper: {
    display: "flex",
    justifyContent: "space-between",
  },

  head: {
    display: "flex",
    alignItems: "center",
  },
  form: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    minHeight: "100vh",
    justifyContent: "center",
  },
  error: {
    margin: "10px",
    color: "#e61414",
    fontSize: "12px",
  },
  formControl: {
    marginTop: "24px",
    minWidth: "160",
    display: "block",
    width: "100%",

    "&  .MuiInputBase-root": {
      width: "96%",
      borderRadius: "10px",
    },
    "&  .MuiButtonBase-root": {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      border: "0px",
      height: "fit-content",
      boxShadow: "none",
      "&:hover": {
        border: "0px",
        background: "none",
      },
      "&:active": {
        background: "none",
        cursor: "default",
        transition: "none",
        textTransform: "none",
        boxShadow: "none",
        backgroundColor: "white",
      },
    },
  },
  hiddenInput: {
    display: "none",
  },
  formControlPhone: {
    display: "flex",
    width: "96%",
    border: "1px solid rgba(0, 0, 0, 0.23)",
    borderRadius: "10px",
    minWidth: "160",
    "&  .MuiInputBase-root": {
      width: "96%",
      borderRadius: "10px",
    },
  },
  textWrapper: {
    display: "flex",
    flexDirection: "column !important",
    justifyContent: "space-around",
    height: "190px",
  },
  imageWrapper: {
    display: "flex",
    alignItems: "center",
  },
});

export default Home;