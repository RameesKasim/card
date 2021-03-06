import { React, Fragment } from "react";
import { TextField, FormControl, Button } from "@mui/material";
import { ErrorMessage } from "formik";
import PhoneInput from "react-phone-input-2";
import defaultUser from "../../assets/defaultUser.jpg";
import "yup-phone";
import "react-phone-input-2/lib/material.css";

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
      <PhoneInput
        country={"ae"}
        variant="outlined"
        enableAreaCodes={true}
        prefix={"+"}
        onChange={(value) => {
          form.setFieldValue(field.name, `+${value}`);
        }}
        value={field.value}
        placeholder={field.name}
        specialLabel=""
        containerClass={`${props.className} ${field.name}`}
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
          props.readURL(event.currentTarget);
        }}
      />
      <label htmlFor={props.id}>
        <Button style={{ dislpay: "none" }} variant="outlined" component="span">
          <img
            src={selectedImage || defaultUser}
            height="100rem"
            width="100rem"
            style={{ cursor: "pointer" }}
            alt=""
          />
          <div
            style={{
              textTransform: "initial",
              color: "rgba(0, 0, 0, 0.6)",
            }}
          >
            Upload Image
          </div>
        </Button>
      </label>
    </FormControl>
  );
};
