import { React, useState, useEffect } from "react";
import {
  Container,
  Grid,
  Box,
  Card,
  InputAdornment,
  Pagination,
  IconButton,
  TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Loader from "../loader";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { get } from "../../utils/apiController";
import defaultImage from "../../images/defaultProfile.png";
import AddIcon from "@mui/icons-material/Add";

const CardList = (props) => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [cardList, setCardList] = useState([]);
  const [imagelist, setImageList] = useState([]);
  const [totalCards, setTotalCards] = useState(0);
  const [page, setPage] = useState(1);
  const perPage = 8;

  useEffect(() => {
    getCards(1);
    // defaut 1st page
  }, []);

  const appentImageList = (imagelist) => {
    let list = [];
    imagelist.map((image) => {
      list.push("data:image/png;base64,".concat(image));
    });
    setImageList(list);
  };

  const getCards = async (page, term = "") => {
    setIsLoading(true);
    await get(`/cardslist/?page_size=${perPage}&page=${page}&search=${term}`)
      .then((response) => {
        setIsLoading(false);
        setCardList(response.data.cardList);
        appentImageList(response.data.images);
        setTotalCards(response.data.totalCards);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };

  let searchCard = (e) => {
    e.preventDefault();
    getCards(1, e.target.value);
  };

  return (
    <Container>
      <Grid container marginTop={2} alignItems="center" spacing={1}>
        <Grid item xs={4}>
          <form>
            <TextField
              fullWidth
              variant="outlined"
              onChange={searchCard}
              label="Search"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      style={{
                        padding: "6px",
                        color: "rgba(0, 0, 0, 0.54)",
                      }}
                    ></SearchIcon>
                  </InputAdornment>
                ),
              }}
            />
          </form>
        </Grid>
        <Grid item xs={4}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-end"
            height="100%"
          >
            <div>
              <Box
                display="inline-block"
                fontWeight="bold"
                fontSize="140%"
                className="MuiTypography-colorPrimary"
                color="primary"
              >
                {totalCards}
              </Box>{" "}
              <b>Results Found</b>
            </div>
            <Box display="flex" alignItems="center">
              {/* <TuneIcon color="primary" /> <b>Filter</b> */}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={4} style={{ display: "flex", justifyContent: "end" }}>
          <IconButton
            style={{ fontSize: "small", borderRadius: "0" }}
            onClick={(e) => {
              e.preventDefault();
              navigate("./../add");
            }}
          >
            <AddIcon color="action" fontSize="medium" />
            Add New Card
          </IconButton>
        </Grid>
      </Grid>
      <br />
      <Grid container spacing={2}>
        {isLoading ? (
          <Loader />
        ) : (
          cardList.map((item, i) => (
            <Grid item xs={4} md={3} key={i}>
              <Box mb={2} mt={2}>
                <Card
                  className={`${classes.cardWrapper} cardListWrapper`}
                  elevation={4}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`../../${item.url}`);
                  }}
                >
                  {item && item.profileimage.length ? (
                    <img src={imagelist[i]} alt="profile-pic" />
                  ) : (
                    <img src={defaultImage} alt="profile-pic" />
                  )}
                  <div>{item.name} </div>
                  <div style={{ fontSize: "smaller", fontWeight: "200" }}>
                    {item.designation}{" "}
                  </div>
                </Card>
              </Box>
            </Grid>
          ))
        )}
      </Grid>

      <Box my={3} style={{ display: "flex", justifyContent: "space-between" }}>
        {totalCards > 8 && (
          <Pagination
            onChange={(_, index) => {
              getCards(index);
              setPage(index);
            }}
            page={page}
            count={Math.ceil(totalCards / perPage)}
          />
        )}
      </Box>
    </Container>
  );
};

const useStyles = makeStyles({
  cardWrapper: {
    display: "flex",
    flexDirection: "column",
    padding: "1rem",
    textAlign: "center",
    cursor: "pointer",
    justifyContent: "space-evenly",
    textOverflow: "ellipsis",
    whiteSpace: " break-spaces",
  },
});

export default CardList;
