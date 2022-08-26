import React from "react";
import "../../styles/inspection/inspectionOverview.scss";

const SupplySelect = ({ id, value, handleChange, description }) => {
  return (
    <div className="row supply-item">
      <span className="supply-name">{description}</span>
      <select
        id={id}
        value={value}
        onChange={(event) => handleChange(event)}
        className="form-control chosen-select custom-select supply-select"
      >
        <option value={"-"}>{"-"}</option>
        {["0", "1", "2", "3", "4", "5"].map((option, ind) => {
          return (
            <option key={ind} value={option}>
              {option}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default SupplySelect;
