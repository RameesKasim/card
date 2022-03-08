import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

const Loader = (props) => {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        zIndex: 1000,
        background: "rgba(239, 243, 255, 0.21)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress />
    </div>
  );
};

export default Loader;
