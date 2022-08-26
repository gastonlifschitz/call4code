import React from "react";
import "../../styles/common/header.css";

const Header = (props) => (
  <header id="header">
    <div className="border-gradient">
      <div className="container h100">
        <div className="row h100">
          <div id="nombre-sitio" className="col-sm-6 col-md-6 h100">
            <a href="/">
              <h1>{String(props.title).substring(0, 25)}</h1>
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
