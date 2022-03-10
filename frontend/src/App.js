import { React, useEffect, useState } from "react";
import Home from "./components/home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Card from "./components/card";
import "./App.scss";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:name" element={<Card />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
