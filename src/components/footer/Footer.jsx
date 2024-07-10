import React from "react";
import "./styles.css";
import { GrLinkedin, GrGithub } from "react-icons/gr";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{ userSelect: "none" }}>
      <p>
        Desenvolvido por <span>Pedro H. Rocha</span>
      </p>
      <div className="div_icons">
        <Link to={"https://www.linkedin.com/in/pedrohrocha16/"}>
          <GrLinkedin />
        </Link>
        <Link to={"https://github.com/pedrohrocha18"}>
          <GrGithub />
        </Link>
      </div>
    </footer>
  );
}
