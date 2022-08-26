import React from "react";
import "../../styles/inspection/beds.scss";

const BedSelect = ({ name, onChange, salas, currentSala }) => {
  const { sala: selected } = currentSala;
  return (
    <div className="row bed">
      <span className="beds-name">{name}</span>
      <div className="controls">
        <div className="form-group has-button">
          <select
            id={"select-opciones-" + name}
            value={selected}
            onChange={(event) => onChange(event)}
            className="form-control chosen-select custom-select beds-select"
          >
            <option defaultValue disabled value={name}>
              {name}
            </option>
            {salas.map((sala, ind) => {
              return (
                <option key={ind} value={sala}>
                  {sala}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </div>
  );
};

export default BedSelect;
