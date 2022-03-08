import React from "react";
import { Box, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import profileImage from "../../assets/profilePic.jpg";
import QRCode from "react-qr-code";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import CallIcon from "@mui/icons-material/Call";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

const details = {
  name: "Ramees Chuthomandy",
  designation: "Web Developer",
  phone1: "+971507077678",
  phone2: "+919496981716",
  email: "rameeschuthomandy@gmail.com",
  linkedin: "rameesKasim",
};

const useStyles = makeStyles({
  mainWrapper: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    minHeight: "100vh",
    justifyContent: "center",
  },
  paperWrapper: {
    paddingBottom: "1.5%",
    width: "50%",
    maxWidth: "480px",
    boxShadow: "0 0 20px 0 rgba(20, 92, 117, 0.3)",
    margin: "3% 0px",
    borderRadius: "12px",
  },
  headWrapper: {
    display: "flex",
    background: "lightgray",
    padding: "3% 3% 0% 3%",
    position: "relative",
    minHeight: "4rem",
    justifyContent: "space-between",
    borderBottom: "8px solid lightgray",
  },
  headImage: {
    borderRadius: "50%",
    width: "7rem",
    position: "absolute",
    left: "33%",
  },
  contentWrapper: {
    display: "flex",
    padding: "4% 10% 0%",
    justifyContent: "space-between",
  },
  rightContent: {
    display: "flex",
    alignItems: "center",
  },
  nameWrapper: {
    display: "flex",
    justifyContent: "center",
    paddingTop: "10%",
    flexDirection: "column",
    alignItems: "center",
  },
  name: {
    fontSize: "2rem",
    color: "aqua",
    fontWeight: "bold",
  },
  iconWrapper: {
    display: "flex",
    margin: "8% 1%",
    cursor: "pointer",
    textDecoration: "none",
    alignItems: "center",
    color: "#00A0EE",
    "& svg": {
      background: "lightgray",
      padding: "3%",
      borderRadius: "50%",
      marginRight: "10%",
    },
  },
  subString: {
    color: "#0000004d",
    lineHeight: ".9rem",
    fontSize: ".7rem",
  },
});

const Card = (props) => {
  const classes = useStyles();
  const url = window.location.href;
  const emailLink = `mailto:${details.email}`;
  const phone1Link = `tel:${details.phone1}`;
  const phone2Link = `tel:${details.phone2}`;
  const linkedinLink = `linkedin.com/${details.linkedin}`;

  return (
    <Box className={classes.mainWrapper}>
      <Paper elivation={2} className={classes.paperWrapper}>
        <div className={classes.headWrapper}>
          <div>
            Icon
            <br /> Name
          </div>
          <img className={classes.headImage} src={profileImage} />
          <div style={{ fontSize: ".6rem" }}>
            Address1
            <br />
            Address2
            <br />
            Address3
            <br />
            phone number{" "}
          </div>
        </div>
        <div className={classes.nameWrapper}>
          <div className={classes.name}>{details.name}</div>
          <div>{details.designation}</div>
        </div>
        <div className={classes.contentWrapper}>
          <div className={classes.leftContent}>
            <a href={emailLink} className={classes.iconWrapper}>
              <MailOutlineIcon />
              <div>
                {details.email}
                <div className={classes.subString}>connect to me</div>
              </div>
              {}
            </a>
            <a href={phone1Link} className={classes.iconWrapper}>
              <CallIcon />
              <div>
                {details.phone1}
                <div className={classes.subString}>connect to me</div>
              </div>
            </a>
            <a href={phone2Link} className={classes.iconWrapper}>
              <CallIcon />
              <div>
                {details.phone2}
                <div className={classes.subString}>connect to me</div>
              </div>
            </a>
            <a href={linkedinLink} className={classes.iconWrapper}>
              <LinkedInIcon />
              <div>
                {details.linkedin}
                <div className={classes.subString}>connect to me</div>
              </div>
            </a>
          </div>
          <div className={classes.rightContent}>
            <QRCode value={url} size={80} />
          </div>
        </div>
      </Paper>
    </Box>
  );
};

export default Card;
