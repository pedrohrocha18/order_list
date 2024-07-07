import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/header/Header";

const App = () => {
  return (
    <div>
      <Header />
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
};

export default App;
