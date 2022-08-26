import React from "react";
import Header from "../common/Header";
import ButtonGroup from "./ButtonGroup";
import "../../styles/inspection/inspectionCategories.scss";

const Observations = ({
  observationTypes,
  currentObservation,
  onCancel,
  onSave,
  handleObservationChange,
}) => {
  const { _type, comment } = currentObservation;

  const maxlength = 1000;
  return (
    <div className="mobile">
      <Header title={"Observations"} />
      <div className="content">
        <div className="observation">
          <h4 className="observation-title">
            Did you have any issues during inspection?
          </h4>
        </div>
        <div className="observation-container">
          <div className="form-group has-button">
            <select
              id="_type"
              value={_type}
              onChange={(event) => handleObservationChange(event)}
              className="form-control chosen-select custom-select"
            >
              <option disabled selected value="">
                Choose a type
              </option>
              {observationTypes.map((type, ind) => {
                const { _id, description } = type;
                const motive =
                  description[0].toUpperCase() + description.slice(1);
                return (
                  <option
                    key={ind}
                    value={_id}
                    selected={_id === _type ? true : false}
                  >
                    {motive}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="comments">
            <textarea
              id="comment"
              value={comment}
              onChange={(event) => handleObservationChange(event)}
              className="form-control input-observations"
              type="text"
              placeholder="type your notes here"
              maxlength={maxlength}
            />
            <span className="comments-disclaimer">
              {`Maximum allowed characters are ${maxlength}.`}
            </span>
          </div>
        </div>
        <ButtonGroup onCancel={onCancel} onSave={onSave} disabled={false} />
      </div>
    </div>
  );
};

export default Observations;
