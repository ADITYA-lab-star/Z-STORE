import React from "react";
import { Link } from "react-router-dom";

const owner_nav = () => {
  return (
    <>
      <div className="Navbar flex items-center gap-4 bg-red-600 px-4">
        <div className="brandname font-extrabold text-8xl text-white">
          Z-STORE
        </div>
        <div className="nav-items  flex gap-4 ml-auto font-bold text-2xl text-white">
          <Link to="/">Add </Link>
          <Link to="/AllProd">Product-List</Link>
        </div>
      </div>
    </>
  );
};

export default owner_nav;
