import { React, useEffect, useState } from "react";
import Home from "./components/home";
import Loader from "./components/loader";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Card from "./components/card";
import store from "./core/store";
import { Provider } from "react-redux";
import "./App.scss";

function App() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <Provider store={store}>
      {loading ? (
        <Loader />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:id" element={<Card />} />
          </Routes>
        </BrowserRouter>
      )}
    </Provider>
  );
}

export default App;
