import React, { Fragment, useState, useEffect } from "react";
import {
  Paper,
  Button,
  Grid,
  Box,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import "yup-phone";
import { setCard } from "../../core/action";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { renderImageUpload, renderPhone, renderInput } from "../formInput";

const validations = Yup.object().shape({
  name: Yup.string().required("Enter  your name"),
  designation: Yup.string().required("Designation required"),
  email: Yup.string().required("Email required").email("Invalid email address"),
  phone: Yup.string().phone(),
  phone2: Yup.string().phone(),
});

const Home = (props) => {
  const classes = useStyles();
  const [initialValues, setInitialValues] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [image, setImage] = useState("");

  const handleSubmit = (values, actions) => {
    console.log(values);
    console.log(values.profileImage);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("designation", values.designation);
    formData.append("phone", values.phone);
    formData.append("phone2", values.phone2);
    formData.append("linkedIn", values.linkedin);
    formData.append("image", values.profileImage);
    console.log(formData);
    axios.post("http://localhost:3000/", formData);

    dispatch(setCard(values));
    // navigate(`/${values.name}`);
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
      phone2: "",
      email: "",
      linkedin: "",
    });
  }, []);

  return (
    <Fragment>
      <Formik
        initialValues={initialValues}
        validationSchema={validations}
        validateOnChange={true}
        validateOnBlur={true}
        enableReinitialize
        onSubmit={(values, actions) => {
          handleSubmit(values, actions);
          actions.setSubmitting(true);
        }}
      >
        {(props) => (
          <Form>
            <Box className={classes.form}>
              <Paper elivation={2} className={classes.wrapper}>
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
                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        <Field
                          name="name"
                          type="text"
                          className={classes.formControl}
                          label="Name"
                          component={renderInput}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        <Field
                          name="designation"
                          type="text"
                          className={classes.formControl}
                          label="Designation"
                          component={renderInput}
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
                          name="phone2"
                          type="text"
                          className={classes.formControlPhone}
                          label="Tel"
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
                          name="profileImage"
                          id="profileImage"
                          className={classes.formControl}
                          inputClass={classes.hiddenInput}
                          component={renderImageUpload}
                          readURL={readURL}
                          selectedImage={image}
                        />
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
  wrapper: {
    padding: "2.2%",
    width: "70%",
    boxShadow: "0 0 20px 0 rgba(20, 92, 117, 0.3)",
    margin: "3% 0px",
    borderRadius: "12px",
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
      width: "46%",
      border: "0px",
      height: "6rem",
      "&:hover": {
        border: "0px",
        background: "none",
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
});

export default Home;
