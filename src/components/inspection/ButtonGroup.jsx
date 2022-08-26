import React from "react";

const ButtonGroup = ({ onCancel, onSave, disabled }) => {
  return (
    <div className="row btn-box">
      <button
        type="button"
        onClick={(event) => onCancel(0)}
        className="btn btn-inverse btn-categories"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={(event) => onSave()}
        className="btn btn-primary btn-categories"
        disabled={disabled}
      >
        Save
      </button>
    </div>
  );
};

export default ButtonGroup;
