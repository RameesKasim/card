import React, { Fragment, useState, useEffect } from "react";
import { Paper, Button, Grid, Box, Dialog, Slider } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import "yup-phone";
import { useNavigate, useParams } from "react-router-dom";
import { renderImageUpload, renderPhone, renderInput } from "../formInput";
import Loader from "../loader";
import AvatarEditor from "react-avatar-editor";
import { post, get, endpoint, put } from "../../utils/apiController";

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
});

const AddCard = (props) => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState(null);
  const navigate = useNavigate();
  const [idError, setIdError] = useState([]);
  const [image, setImage] = useState("");
  const [imageChanged, setImageChanged] = useState(null);
  const [open, setOpen] = useState(false);
  const [zoomValue, setZoomValue] = useState(1);
  const [editorImage, setEditorImage] = useState("");

  useEffect(() => {
    setIsLoading(true);
    if (!id) {
      setImage("");
      setInitialValues({
        name: "",
        designation: "",
        phone: "",
        whatsapp: "",
        email: "",
        linkedin: "",
        profileImage: "",
      });
      setIsLoading(false);
    } else {
      get(`/carddetails/${id}`)
        .then((res) => {
          setIsLoading(false);
          console.log(res.data);
          setInitialValues({
            name: res.data.name,
            designation: res.data.designation,
            phone: res.data.phone,
            whatsapp: res.data.whatsapp,
            email: res.data.email,
            linkedin: res.data.linkedin,
            profileImage: "",
          });

          res.data && res.data.profileimage.length > 0
            ? setImage(`${endpoint.live}/uploads/${res.data.profileimage}`)
            : setImage("");
        })
        .catch((error) => {
          setIsLoading(false);
        });
    }
  }, []);

  const handleSubmit = async (values, actions) => {
    let formData = new FormData();
    formData.append("name", values.name);
    formData.append("username", values.name.toLowerCase().replaceAll(' ', ''));
    formData.append("designation", values.designation);
    formData.append("email", values.email);
    formData.append("whatsapp", values.whatsapp);
    formData.append("phone", values.phone);
    formData.append("linkedin", values.linkedin);
    if (imageChanged) formData.append("file", dataURLtoBlob(image));
    else formData.append("file", image);
    if (!id) {
      await post(`/card`, formData)
        .then((res) => {
          navigate(`/${res.data.username}`);
        })
        .catch((error) => {
          const errorMesssage = error.data[0].message;
          errorMesssage.includes("User")
            ? actions.setFieldError("name", errorMesssage)
            : errorMesssage.includes("Email")
              ? actions.setFieldError("email", errorMesssage)
              : errorMesssage.includes("Phone")
                ? actions.setFieldError("phone", errorMesssage)
                : errorMesssage.includes("WhatsApp")
                  ? actions.setFieldError("whatsapp", errorMesssage)
                  : errorMesssage.includes("Linkedin")
                    ? actions.setFieldError("linkedin", errorMesssage)
                    : setIdError(error.response.data);
        });
    }
    if (id) {
      await put(`/card/${id}`, formData)
        .then((res) => {
          navigate(`/${res.data.username}`);
        })
        .catch((error) => {
          const errorMesssage = error.data[0].message;
          errorMesssage.includes("User")
            ? actions.setFieldError("name", errorMesssage)
            : errorMesssage.includes("Email")
              ? actions.setFieldError("email", errorMesssage)
              : errorMesssage.includes("Phone")
                ? actions.setFieldError("phone", errorMesssage)
                : errorMesssage.includes("WhatsApp")
                  ? actions.setFieldError("whatsapp", errorMesssage)
                  : errorMesssage.includes("Linkedin")
                    ? actions.setFieldError("linkedin", errorMesssage)
                    : setIdError(error.response.data);
        });
    }
  };

  const dataURLtoBlob = (dataurl) => {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime, name: "profilePic.png'" });
  };

  const readURL = (input) => {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        setImage(e.target.result);
        setOpen(true);
        setImageChanged(true);
      };

      reader.readAsDataURL(input.files[0]);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleZoom = (event, newValue) => {
    setZoomValue(newValue);
  };

  const setEditor = (value) => {
    setEditorImage(value);
  };

  const handleImageEdit = () => {
    const canvasScaled = editorImage.getImageScaledToCanvas();
    const croppedImg = canvasScaled.toDataURL();
    setImage(croppedImg);
    setOpen(false);
  };

  const handleCancel = () => {
    if (id) {
      navigate(`/${initialValues.name.toLowerCase().replaceAll(' ', '')}`);
    } else {
      navigate("/card/lists");
    }
  };

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
                  <Dialog open={open} onClose={handleClose}>
                    <Paper className={classes.avatarEditorWrapper}>
                      <AvatarEditor
                        image={image}
                        width={200}
                        height={200}
                        border={0}
                        color={[255, 255, 255, 0.6]}
                        scale={zoomValue}
                        ref={setEditor}
                      />
                      <Slider
                        aria-label="Zoom"
                        size="small"
                        defaultValue={1}
                        min={1}
                        max={2}
                        step={0.1}
                        onChange={handleZoom}
                        style={{ width: "85%" }}
                      />
                      <div>
                        <Button
                          variant="contained"
                          className={classes.imageButton}
                          type="submit"
                          onClick={handleImageEdit}
                        >
                          Save
                        </Button>
                      </div>
                    </Paper>
                  </Dialog>
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
                    <Button
                      variant="outlined"
                      onClick={(e) => {
                        e.preventDefault();
                        handleCancel();
                      }}
                    >
                      Cancel
                    </Button>
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
    minHeight: "86vh",
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
    width: "96% !important",
    border: "1px solid rgba(0, 0, 0, 0.23)",
    borderRadius: "10px !important",
    minWidth: "160",
    background: "#ffffff00 !important",
    height: "56px",

    "&  .form-control": {
      width: "100% !important",
      background: "#ffffff00 !important",
      border: "0px solid rgba(0, 0, 0, 0.23) !important",
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
  avatarEditorWrapper: {
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  imageButton: {
    lineHeight: ".51rem",
    padding: "12px 26px !important",
  },
});

export default AddCard;
