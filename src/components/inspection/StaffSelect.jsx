import React from "react";
import "../../styles/inspection/beds.scss";

const StaffSelect = ({ description, cantidad, handleStaffChange }) => {
  return (
    <div className="row staff-item">
      <span className="supply-name">{description}</span>
      <select
        id={description}
        value={cantidad}
        onChange={(event) => handleStaffChange(event)}
        className="form-control chosen-select custom-select staff-select"
      >
        <option value={"-"}>{"-"}</option>
        {Array.apply(0, Array(16))
          .map(function (value, index) {
            return index;
          })
          .map((cantidad, ind) => {
            return (
              <option key={ind} value={ind}>
                {cantidad}
              </option>
            );
          })}
      </select>
    </div>
  );
};

export default StaffSelect;
