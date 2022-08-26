import React from "react";
import Header from "../common/Header";
import ButtonGroup from "./ButtonGroup";
import SupplySelect from "./SupplySelect";
import lifeIcon from "../../images/life.svg";
import "../../styles/inspection/inspectionCategories.scss";

const Supplies = ({
  onSave,
  handleChange,
  onCancel,
  supplyTypes,
  supplies,
}) => {
  return (
    <div className="mobile">
      <Header title={"Supply"} />
      <div className="content supplies-screen">
        <div className="row section-header">
          <img src={lifeIcon} alt="supply" className="category-icon" />
        </div>
        <div>
          <p className="disclaimer">
            Indicate stocks in terms of days availability.
          </p>
        </div>
        <div className="cards-container-categ">
          <div className="card">
            {supplyTypes.map((supply, ind) => {
              const { description, _id } = supply;
              return (
                <SupplySelect
                  key={ind}
                  id={_id}
                  handleChange={handleChange}
                  value={supplies[ind].dias}
                  description={description}
                />
              );
            })}
          </div>
        </div>
        <ButtonGroup onCancel={onCancel} onSave={onSave} disabled={false} />
      </div>
    </div>
  );
};

export default Supplies;
