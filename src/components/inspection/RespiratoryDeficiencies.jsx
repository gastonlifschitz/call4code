import React, { Component } from "react";
import Header from "../common/Header";
import ButtonGroup from "./ButtonGroup";
import lifeIcon from "../../images/report.svg";
import "../../styles/inspection/inspectionCategories.scss";

class RespiratoryDeficiencies extends Component {
  render() {
    const {
      onSave,
      respiratoryDeficiencyTypes,
      handleChange,
      onCancel,
      data,
    } = this.props;
    return (
      <div className="mobile">
        <Header title={"Critical Patients"} />
        <div className="content supplies-screen">
          <div className="row section-header">
            <img src={lifeIcon} alt="supply" className="category-icon" />
          </div>
          <div>
            <p className="disclaimer">
              Indicate percentage of critical patients with respiratory
              conditions.
            </p>
          </div>
          <div className="cards-container-categ">
            <div className="card">
              {respiratoryDeficiencyTypes.map((respiratoryDeficiency, ind) => {
                const { _id, description } = respiratoryDeficiency;
                return (
                  <div className="row resp-item">
                    <h5 className="respdef-name">{description}</h5>
                    <div className="percentage-box">
                      <input
                        id={_id}
                        value={data[ind].cantidad}
                        onChange={(event) => handleChange(event)}
                        className="form-control respdef-input "
                        type="number"
                        placeholder="-"
                        max={
                          description === "deceased" || description === "high"
                            ? "999"
                            : "100"
                        }
                        min="0"
                        key={ind}
                        required
                      />
                      <span
                        className={`percentage ${
                          ["deceased", "high"].includes(description)
                            ? "oculto"
                            : ""
                        }`}
                      >
                        %
                      </span>
                    </div>
                  </div>
                );
              })}
              <div>
                <p className="disclaimer"></p>
              </div>
            </div>
          </div>
          <ButtonGroup onCancel={onCancel} onSave={onSave} disabled={false} />
        </div>
      </div>
    );
  }
}

export default RespiratoryDeficiencies;
