import { React, useState, useEffect } from "react";
import {
  Container,
  Grid,
  Box,
  Card,
  FormControl,
  OutlinedInput,
  InputAdornment,
  InputLabel,
  Pagination,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { get } from "../../utils/apiController";
import defaultImage from "../../images/defaultProfile.png";

const CardList = (props) => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [cardList, setCardList] = useState([]);
  const [totalCards, setTotalCards] = useState(0);
  const perPage = 10;

  useEffect(() => {
    getCards(1); // defaut 1st page
  }, []);

  const getCards = async (page, term = "") => {
    await get(`/cardslist/?page_size=${perPage}&page=${page}&search=${term}`)
      .then((response) => {
        console.log(response.data);
        setCardList(response.data.cardList);
        setTotalCards(response.data.totalCards);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  let searchCard = (e) => {
    e.preventDefault();
    getCards(1, e.target.value);
  };

  return (
    <Container>
      <Grid container marginTop={2} alignItems="center" spacing={1}>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
          <form>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Search</InputLabel>
              <OutlinedInput
                onChange={searchCard}
                endAdornment={
                  <InputAdornment position="end">
                    <SearchIcon
                      style={{
                        padding: "12px",
                        color: "rgba(0, 0, 0, 0.54)",
                      }}
                    ></SearchIcon>
                  </InputAdornment>
                }
              ></OutlinedInput>
            </FormControl>
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
      </Grid>
      <br />
      <Grid container spacing={2}>
        {cardList.map((item, i) => (
          <Grid item xs={3}>
            <Box mb={2} mt={2} key={i}>
              <Card
                className={classes.cardWrapper}
                elevation={4}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`../../${item.name}`);
                }}
              >
                <img src={defaultImage} style={{ borderRadius: "50%" }} />
                <div>{item.name} </div>
                <div style={{ fontSize: "smaller", fontWeight: "200" }}>
                  {item.designation}{" "}
                </div>
              </Card>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box my={3} style={{ display: "flex", justifyContent: "space-between" }}>
        {totalCards > 10 && (
          <Pagination
            onChange={(_, index) => getCards(index)}
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
  },
});

export default CardList;
