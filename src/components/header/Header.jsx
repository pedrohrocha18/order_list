import React from "react";
import logo from "../../assets/images/logo.png";
import "./styles.css";

const Header = () => {
  return (
    <header>
      <div>
        <img src={logo} alt="logo" />
      </div>
      <div>
        <h1>Order List</h1>
      </div>
    </header>
  );
};

export default Header;
