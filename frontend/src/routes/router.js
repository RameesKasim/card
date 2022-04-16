import { React, Fragment } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "../components/login";
import Card from "../components/card";
import CardList from "../components/cardList";
import AddCard from "../components/addCard";

const Router = (props) => {
  const isAuthenticated = localStorage.getItem("isLogin") === "true";

  const HomeRoute = ({ children }) => {
    return <Navigate to="/login" />;
  };

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Fragment>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <HomeRoute>
                <Card />
              </HomeRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/:name" element={<Card />} />
          <Route
            path="/card/lists"
            element={
              <PrivateRoute>
                <CardList />
              </PrivateRoute>
            }
          />
          <Route
            path="/card/add"
            element={
              <PrivateRoute>
                <AddCard />
              </PrivateRoute>
            }
          />
          <Route
            path="/card/edit/:url"
            element={
              <PrivateRoute>
                <AddCard />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
};

export default Router;
