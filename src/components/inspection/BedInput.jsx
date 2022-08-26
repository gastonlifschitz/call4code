import React from "react";
import "../../styles/inspection/beds.scss";

const BedInput = ({ onChange, name, value, max }) => {
  return (
    <div className="row bed-group">
      <h5 className="beds-caption">{name}</h5>
      <input
        id={name}
        className="form-control bed-input"
        onChange={(event) => onChange(event)}
        type="number"
        min="0"
        max={max}
        placeholder="-"
        value={value}
        required
      />
    </div>
  );
};

export default BedInput;
