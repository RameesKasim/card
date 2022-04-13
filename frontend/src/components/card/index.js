import { React, useEffect, forwardRef, useState, Fragment } from "react";
import {
  Box,
  Paper,
  Button,
  Tooltip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { makeStyles } from "@mui/styles";
import { useNavigate, useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaLinkedin,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import companyLogo from "../../images/logo.png";
import defaultImage from "../../images/defaultProfile.png";
import Loader from "../loader";
import { saveAs } from "file-saver";
import { get, endpoint, deleteReqeust } from "../../utils/apiController";
import DeleteIcon from "@mui/icons-material/Delete";
import EditButton from "@mui/icons-material/Edit";

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
    position: "relative",
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
    padding: ".2rem .2rem",
    fontSize: ".875rem",
    lineHeight: "1",
    fontWeight: "500",
    marginBottom: "1rem",
    // background: "#e6e8ea",
    borderRadius: ".25rem",
    transition: "background .2s 0s ease",
    marginTop: ".5rem",
    "&:hover": {
      // backgroundColor: "#ACB9BE",
    },
  },
  LinkWrapper: {
    display: "flex",
    padding: ".35rem 0rem",
    cursor: "pointer",
    textDecoration: "none",
    alignItems: "center",
    minHeight: "50px",
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
    fontWeight: "300",
    lineHeight: "1.4",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  subString: {
    color: "#525f66",
    lineHeight: "1rem",
    fontSize: ".87rem",
    fontWeight: "200",
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
  subMenu: {
    position: "absolute",
    top: "0",
    display: "flex",
    right: "1rem",
    padding: "1rem",
  },
});

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Card = (props) => {
  const classes = useStyles();
  const name = useParams();
  const [open, setOpen] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [cardDetails, setCardDetails] = useState(null);
  const [isLoading, setIsLoading] = useState();
  const [loggedIN, setLoggedIn] = useState(false);
  const url = window.location.href;
  const emailLink = cardDetails ? `mailto:${cardDetails.email}` : "";
  const whatsappLink = cardDetails ? `https:wa.me/${cardDetails.whatsapp}` : "";
  const phoneLink = cardDetails ? `tel:${cardDetails.phone}` : "";
  const linkedinLink = cardDetails
    ? `https:linkedin.com/in/${cardDetails.linkedin}`
    : "";
  const location = "10th Floor Capricorn Tower, \nSheikh Zayed Road Dubai";
  const locationLink = `http://maps.google.com/maps?q=Capricorn Tower+Dubai`;

  useEffect(() => {
    setIsLoading(true);
    setLoggedIn(localStorage.getItem("isLogin"));
    get(`/card/${name.name}`)
      .then((res) => {
        setCardDetails(res.data);
        setImage(`${endpoint.live}/uploads/${res.data.profileimage}`);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error.data);
      });
  }, [name]);

  const downloadVcard = () => {
    get(`/vcard/${name.name}`)
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

  const handleDelete = () => {
    setOpen(false);
    deleteReqeust(`/card/${name.name}`)
      .then((res) => {
        console.log(res.data);
        setOpenSnackBar(true);
        navigate("../card/lists");
      })
      .catch((error) => {
        console.log(error.data);
      });
    console.log("deleted");
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  };

  return (
    <Box className="cardWrapper">
      {isLoading ? (
        <Loader />
      ) : (
        <Fragment>
          {cardDetails && (
            <Paper elivation={12} className={classes.paperWrapper}>
              <Snackbar
                open={openSnackBar}
                autoHideDuration={3000}
                onClose={handleCloseSnackBar}
              >
                <Alert
                  onClose={handleCloseSnackBar}
                  severity="success"
                  sx={{ width: "100%" }}
                >
                  Card Deleted!
                </Alert>
              </Snackbar>
              <div className={classes.qrWrapper}>
                <QRCode value={url} size={150} />
                {loggedIN !== "false" && (
                  <div className={classes.subMenu}>
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`../card/edit/${cardDetails.card_id}`);
                        }}
                      >
                        <EditButton fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={(e) => {
                          e.preventDefault();
                          setOpen(true);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Dialog
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="draggable-dialog-title"
                    >
                      <DialogTitle
                        style={{ cursor: "move" }}
                        id="draggable-dialog-title"
                      >
                        Delete
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Are you sure you want to permenently delete this card
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          autoFocus
                          onClick={(e) => {
                            e.preventDefault();
                            setOpen(false);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                          }}
                        >
                          Delete
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </div>
                )}
              </div>
              <div className={classes.titleWrapper}>
                <img
                  alt="company logo"
                  src={companyLogo}
                  style={{ width: "100%" }}
                />
              </div>
              <div className={classes.imageWrapper}>
                <img
                  className={classes.headImage}
                  alt="profile pic"
                  key={cardDetails.profileimage}
                  src={
                    cardDetails && cardDetails.profileimage.length
                      ? image
                      : defaultImage
                  }
                />
              </div>
              <div className={classes.contentWrapper}>
                <div className={classes.name}>{cardDetails.name}</div>
                <div className={classes.designation}>
                  {cardDetails.designation}
                </div>
                <div className={classes.qualification}></div>
                <a
                  href={emailLink}
                  rel="noopener noreferrer"
                  className={classes.LinkWrapper}
                >
                  <div className={classes.iconWrapper}>
                    <FaEnvelope />
                  </div>
                  <div className={classes.detail}>
                    {cardDetails.email}
                    <div className={classes.subString}>Drop me an email</div>
                  </div>
                  {}
                </a>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.LinkWrapper}
                >
                  <div className={classes.iconWrapper}>
                    <FaWhatsapp />
                  </div>
                  <div className={classes.detail}>
                    {cardDetails.whatsapp}
                    <div className={classes.subString}>Whatsapp me</div>
                  </div>
                </a>
                <a href={phoneLink} className={classes.LinkWrapper}>
                  <div className={classes.iconWrapper}>
                    <FaPhoneAlt />
                  </div>
                  <div className={classes.detail}>
                    {cardDetails && cardDetails.phone}
                    <div className={classes.subString}>Drop me a line</div>
                  </div>
                </a>
                {cardDetails && cardDetails.linkedin.length > 0 && (
                  <a
                    href={linkedinLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes.LinkWrapper}
                  >
                    <div className={classes.iconWrapper}>
                      <FaLinkedin />
                    </div>

                    <div className={classes.detail}>
                      {cardDetails.linkedin}
                      <div className={classes.subString}>Lets connect</div>
                    </div>
                  </a>
                )}
                <a
                  href={locationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.LinkWrapper}
                >
                  <div className={classes.iconWrapper}>
                    <FaMapMarkerAlt />
                  </div>
                  <div className={classes.detail}>
                    {location}
                    <div className={classes.subString}>Visit us</div>
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
          {!cardDetails && <div>Details for {name.name} not found </div>}
        </Fragment>
      )}
    </Box>
  );
};

export default Card;
