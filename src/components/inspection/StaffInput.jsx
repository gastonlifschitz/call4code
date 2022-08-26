import React from "react";
import "../../styles/inspection/beds.scss";

const StaffInput = ({ description, cantidad, handleStaffChange }) => {
  return (
    <div className="row staff-item">
      <h5 className="supply-name">{description}</h5>
      <div className="percentage-box">
        <input
          id={description}
          value={cantidad}
          onChange={(event) => handleStaffChange(event)}
          className="form-control staff-input"
          type="number"
          placeholder="-"
          max="100"
          min="0"
          required
        />
        <span className="percentage">%</span>
      </div>
    </div>
  );
};

export default StaffInput;
