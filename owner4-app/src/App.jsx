import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/owner_nav.jsx";
import Home from "./components/owner_home.jsx";
import AllProd from "./components/owner_prodList.jsx";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/AllProd" element={<AllProd />} />
          {/* Add more routes here for Products, About, Contact pages */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
