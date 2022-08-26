import React from "react";

import Header from "../common/Header";
import BedSelect from "./BedSelect";
import BedInput from "./BedInput";
import ButtonGroup from "./ButtonGroup";

import bedIcon from "../../images/bed.svg";

import "../../styles/inspection/home.scss";
import "../../styles/common/bastrap.css";

const Beds = (props) => {
  const { handleBedsInput, handleBedsSelect } = props;
  const { onCancel, onSave } = props;
  const { currentSala, salas } = props;
  const {
    existentes,
    disponibles,
    sala,
    ocupadas,
    supernumerarias,
  } = currentSala;

  return (
    <div className="mobile">
      <Header title={"Beds"} />
      <div className="content">
        <div className="row section-header">
          <img src={bedIcon} alt="bed" className="category-icon" />
        </div>
        <div>
          <p className="disclaimer">Select bed type and complete information.</p>
        </div>
        <div className="cards-container-categ">
          <div className="card">
            <div className="row">
              <BedSelect
                name={"Tipo de cama"}
                salas={salas}
                currentSala={currentSala}
                onChange={handleBedsSelect}
              />
            </div>
            <div>
              <p className="disclaimer">
                {`Selected bed type: ${sala}`} <br />
                {`Beds in stock: ${existentes}`} <br />
                {`Beds available: ${disponibles}`} <br />
              </p>
            </div>

            <div className="bed-inputs">
              <BedInput
                name="Ocuppied"
                value={ocupadas}
                onChange={handleBedsInput}
                max={disponibles}
              />
              {
                // Hardcode to test hotel rooms inspection
                (!sala || sala !== "Habitación") && (
                  <BedInput
                    name="Transitory"
                    value={supernumerarias}
                    onChange={handleBedsInput}
                  />
                )
              }
            </div>
          </div>
        </div>

        <ButtonGroup
          onCancel={onCancel}
          onSave={onSave}
          disabled={(ocupadas || supernumerarias) === "" ? true : false}
        />
      </div>
    </div>
  );
};

export default Beds;
