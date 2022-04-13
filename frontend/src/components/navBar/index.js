import { React, useEffect, useState } from "react";
import companyLogo from "../../images/logo.png";
import {
  Menu,
  MenuItem,
  IconButton,
  Box,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { makeStyles } from "@mui/styles";

const NavBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [login, SetLogin] = useState(false);
  const classes = useStyles();
  const origin = window.location.origin;
  useEffect(() => {
    let isLogin = localStorage.getItem("isLogin");
    SetLogin(isLogin);
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    localStorage.setItem("isLogin", false);
    localStorage.removeItem("access-token");
    window.location.href = `${origin}/login`;
  };

  return (
    <Box className={classes.navWrapper}>
      <IconButton
        className={classes.IconButton}
        onClick={(e) => {
          e.preventDefault();
          window.location.href = `${origin}/card/lists`;
        }}
      >
        <img alt="company logo" src={companyLogo} style={{ height: "3rem" }} />
      </IconButton>
      {login !== "false" && (
        <IconButton
          className={classes.IconButton}
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <PersonIcon fontSize="small" />
        </IconButton>
      )}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          className={classes.MenuItem}
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText fontSize="small">Logout</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

const useStyles = makeStyles({
  navWrapper: {
    display: "flex",
    width: "100%",
    height: "3rem",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem 0rem",
    background: "white",
  },
  IconButton: {
    padding: "1rem !important",
  },
  MenuItem: {
    width: "10rem",
    display: "flex",
    justifyContent: "space-around",
  },
});

export default NavBar;
