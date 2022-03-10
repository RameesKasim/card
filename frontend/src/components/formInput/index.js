import { React, Fragment } from "react";
import { TextField, FormControl, Button } from "@mui/material";
import { ErrorMessage } from "formik";
import MuiPhoneNumber from "mui-phone-number";
import defaultUser from "../../assets/defaultUser.jpg";
import * as Yup from "yup";
import "yup-phone";

export const renderInput = ({ field, form, ...props }) => {
  return (
    <Fragment>
      <TextField variant="outlined" {...field} {...props} fullWidth />
      <ErrorMessage component="span" className="error" name={field.name} />
    </Fragment>
  );
};

export const renderPhone = ({ field, form, ...props }) => {
  return (
    <Fragment>
      <MuiPhoneNumber
        defaultCountry="ae"
        variant="outlined"
        onChange={(value) => {
          form.setFieldValue(field.name, value);
        }}
        {...props}
        fullWidth
      />
      <ErrorMessage component="span" className="error" name={field.name} />
    </Fragment>
  );
};

export const renderImageUpload = ({ field, form, selectedImage, ...props }) => {
  return (
    <FormControl className={props.className}>
      <input
        accept="image/*"
        className={props.inputClass}
        id={props.id}
        // {...field}
        type="file"
        onChange={(event) => {
          console.log(event.currentTarget.files[0]);
          console.log(event.currentTarget.files);
          console.log(form.values)
          event.currentTarget.files.length > 0 &&
            form.setFieldValue(props.id, event.currentTarget.files[0]);
            props.readURL(event.currentTarget);
        }}
      />
      <label htmlFor={props.id}>
        <Button style={{ dislpay: "none" }} variant="outlined" component="span">
          <img
            src={selectedImage || defaultUser}
            height="100rem"
            style={{ position: "absolute", left: "0%", cursor: "pointer" }}
            alt=""
          />
          <div
            style={{
              position: "absolute",
              textTransform: "initial",
              color: "rgba(0, 0, 0, 0.6)",
              left: "2%",
              top: "99%",
            }}
          >
            Upload Image
          </div>
        </Button>
      </label>
    </FormControl>
  );
};
