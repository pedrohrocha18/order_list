import React from "react";
import { Link } from "react-router-dom";
import logo from '../../assets/images/logo.png'
import './styles.css'

const Header = () => {
  return (
    <header>
      <img src={logo} alt="logo" />
      <nav>
        <ul>
          <li>
            <Link to={'/'} className="link">Home</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
