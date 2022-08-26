import React from "react";
import Header from "./Header";
import "../../styles/common/spinner.scss";

const Spinner = () => (
  <div className="mobile">
    <Header title="Loading..." />
    <div className="content">
      <div className="loader">Loading</div>
    </div>
  </div>
);

export default Spinner;
