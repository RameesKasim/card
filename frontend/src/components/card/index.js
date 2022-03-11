import { React, useEffect, useState } from "react";
import { Box, Paper, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import CallIcon from "@mui/icons-material/Call";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import axios from "axios";
import companyLogo from "../../images/logo.png";
import defaultImage from "../../images/defaultProfile.png";
import Loader from "../loader";
import { saveAs } from "file-saver";

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
    alignItems: "center",
  },
  headImage: {
    borderRadius: "50%",
    width: "7rem",
    height: "7rem",
    position: "absolute",
    left: "33%",
    top: "15%",
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
    textTransform: "capitalize",
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
  leftContent: {
    width: "75%",
  },
  btnWrapper: {
    display: "flex",
    justifyContent: "center",
  },
});

const Card = (props) => {
  const classes = useStyles();
  const name = useParams();
  const [cardDetails, setCardDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const url = window.location.href;
  const emailLink = `mailto:${cardDetails.email}`;
  const phone1Link = `tel:${cardDetails.phone1}`;
  const phone2Link = `tel:${cardDetails.phone2}`;
  const linkedinLink = `https:linkedin.com/in/${cardDetails.linkedin}`;

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/${name.name}`)
      .then((res) => {
        setCardDetails(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const downloadVcard = () => {
    axios
      .get(`http://localhost:5000/vcard/${name.name}`)
      .then((res) => {
        let file = new File([res.data], `${name.name}.vcf`, {
          type: "text/plain;charset=utf-8",
        });
        saveAs(file);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Box className={classes.mainWrapper}>
      {isLoading ? (
        <Loader />
      ) : (
        <Paper elivation={2} className={classes.paperWrapper}>
          <div className={classes.headWrapper}>
            <div style={{ width: "20%" }}>
              <img src={companyLogo} style={{ width: "94%" }} />
            </div>
            <img
              className={classes.headImage}
              src={
                cardDetails.profileimage.length
                  ? `http://localhost:5000/uploads/${cardDetails.profileimage}`
                  : defaultImage
              }
            />
            <div
              style={{ fontSize: ".6rem", color: "white", fontWeight: "600" }}
            >
              Capricorn Tower – 10th Floor,
              <br />
              Sheikh Zayed Road
              <br />
              Dubai, United Arab Emirates
              <br />
            </div>
          </div>
          <div className={classes.nameWrapper}>
            <div className={classes.name}>{cardDetails.name}</div>
            <div>{cardDetails.designation}</div>
          </div>
          <div className={classes.contentWrapper}>
            <div className={classes.leftContent}>
              <a href={emailLink} className={classes.iconWrapper}>
                <MailOutlineIcon />
                <div>
                  {cardDetails.email}
                  <div className={classes.subString}>connect to me</div>
                </div>
                {}
              </a>
              <a href={phone1Link} className={classes.iconWrapper}>
                <CallIcon />
                <div>
                  {cardDetails.phone}
                  <div className={classes.subString}>connect to me</div>
                </div>
              </a>
              {cardDetails.phonetwo && (
                <a href={phone2Link} className={classes.iconWrapper}>
                  <CallIcon />
                  <div>
                    {cardDetails.phonetwo}
                    <div className={classes.subString}>connect to me</div>
                  </div>
                </a>
              )}
              {cardDetails.linkedin && (
                <a
                  href={linkedinLink}
                  target="_blank"
                  className={classes.iconWrapper}
                >
                  <LinkedInIcon />
                  <div>
                    {cardDetails.linkedin}
                    <div className={classes.subString}>connect to me</div>
                  </div>
                </a>
              )}
            </div>
            <div className={classes.rightContent}>
              <QRCode value={url} size={80} />
            </div>
          </div>
          <div className={classes.btnWrapper}>
            <Button variant="contained" onClick={downloadVcard}>
              Add to Contacts
            </Button>
          </div>
        </Paper>
      )}
    </Box>
  );
};

export default Card;
