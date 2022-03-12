import { React, useEffect, useState } from "react";
import { Box, Paper, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import { FaPhoneAlt, FaWhatsapp, FaLinkedin, FaEnvelope } from "react-icons/fa";
import axios from "axios";
import companyLogo from "../../images/logo.png";
import defaultImage from "../../images/defaultProfile.png";
import Loader from "../loader";
import { saveAs } from "file-saver";

const useStyles = makeStyles({
  paperWrapper: {
    paddingBottom: "1.5%",
    width: "100%",
    maxWidth: "440px",
    margin: "3% 0px",
    borderRadius: "12px !important",
  },
  qrWrapper: {
    display: "flex",
    padding: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  titleWrapper: {
    padding: "0% 13%",
  },
  imageWrapper: {
    position: "relative",
    padding: ".7%",
    backgroundColor: "#acb9be24",
  },
  headImage: {
    borderRadius: "50%",
    width: "5.2rem",
    height: "5.2rem",
    position: "absolute",
    right: "3%",
    top: "-50px",
  },
  contentWrapper: {
    display: "flex",
    margin: "2rem 1.5rem 1.5rem 1.5rem",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  name: {
    fontSize: "2rem",
    fontWeight: "500",
    lineHeight: "1.3",
  },
  designation: {
    fontSize: "1.5rem",
    fontWeight: "400",
    lineHeight: "1.2",
    whiteSpace: "pre-wrap",
  },
  qualification: {
    width: "fit-content",
    padding: ".5rem .5rem",
    fontSize: ".875rem",
    lineHeight: "1",
    fontWeight: "500",
    marginBottom: "1.5rem",
    background: "#e6e8ea",
    borderRadius: ".25rem",
    transition: "background .2s 0s ease",
    marginTop: ".5rem",
    "&:hover": {
      backgroundColor: "#ACB9BE",
    },
  },
  LinkWrapper: {
    display: "flex",
    padding: ".35rem 0rem",
    cursor: "pointer",
    textDecoration: "none",
    alignItems: "center",
  },
  iconWrapper: {
    height: "40px",
    width: "40px",
    borderRadius: "50%",
    background: "#acb9be",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "background .2s",
    color: "#ffff",
    fontSize: " 1.25rem",
    "&:hover": {
      backgroundColor: "#acb9bed1",
    },
  },
  detail: {
    marginLeft: ".875rem",
    fontSize: "1rem",
    color: "black",
    fontWeight: "700",
  },
  subString: {
    color: "#0000004d",
    lineHeight: ".9rem",
    fontSize: ".7rem",
  },
  btnWrapper: {
    display: "flex",
    justifyContent: "center",
    position: "sticky",
    bottom: "0",
    zIndex: "1",
    padding: "0.75rem 0 calc(1.375rem + var(--bottom-safety-height, 0rem))",
    backgroundColor: "#fff9",
  },
});

const Card = (props) => {
  const classes = useStyles();
  const name = useParams();
  const [cardDetails, setCardDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const url = window.location.href;
  const emailLink = `mailto:${cardDetails.email}`;
  const whatsappLink = `https:wa.me/${cardDetails.whatsapp}`;
  const phoneLink = `tel:${cardDetails.phone}`;
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
    <Box className="cardWrapper">
      {isLoading ? (
        <Loader />
      ) : (
        <Paper elivation={12} className={classes.paperWrapper}>
          <div className={classes.qrWrapper}>
            <QRCode value={url} size={150} />
          </div>
          <div className={classes.titleWrapper}>
            <img src={companyLogo} style={{ width: "100%" }} />
          </div>
          <div className={classes.imageWrapper}>
            <img
              className={classes.headImage}
              src={
                cardDetails.profileimage.length
                  ? `http://localhost:5000/uploads/${cardDetails.profileimage}`
                  : defaultImage
              }
            />
          </div>
          <div className={classes.contentWrapper}>
            <div className={classes.name}>{cardDetails.name}</div>
            <div className={classes.designation}>{cardDetails.designation}</div>
            <div className={classes.qualification}>
              {cardDetails.qualification}
            </div>
            <a href={emailLink} className={classes.LinkWrapper}>
              <div className={classes.iconWrapper}>
                <FaEnvelope />
              </div>
              <div className={classes.detail}>
                {cardDetails.email}
                <div className={classes.subString}>connect to me</div>
              </div>
              {}
            </a>
            <a href={whatsappLink} className={classes.LinkWrapper}>
              <div className={classes.iconWrapper}>
                <FaWhatsapp />
              </div>
              <div className={classes.detail}>
                {cardDetails.whatsapp}
                <div className={classes.subString}>connect to me</div>
              </div>
            </a>
            <a href={phoneLink} className={classes.LinkWrapper}>
              <div className={classes.iconWrapper}>
                <FaPhoneAlt />
              </div>
              <div className={classes.detail}>
                {cardDetails.phone}
                <div className={classes.subString}>connect to me</div>
              </div>
            </a>
            <a
              href={linkedinLink}
              target="_blank"
              className={classes.LinkWrapper}
            >
              <div className={classes.iconWrapper}>
                <FaLinkedin />
              </div>
              <div className={classes.detail}>
                {cardDetails.linkedin}
                <div className={classes.subString}>connect to me</div>
              </div>
            </a>
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
