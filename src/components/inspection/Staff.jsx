import React from "react";
import Header from "../common/Header";
import ButtonGroup from "./ButtonGroup";
import StaffInput from "./StaffInput";
import StaffSelect from "./StaffSelect";
import staffIcon from "../../images/doctor.svg";

import "../../styles/inspection/inspectionCategories.scss";

const Staff = ({ staff, staffTypes, onCancel, onSave, handleStaffChange }) => {
  console.log(staff);
  console.log(staffTypes);
  return (
    <div className="mobile">
      <Header title="Staff" />
      <div className="content">
        <div className="row section-header">
          <img src={staffIcon} alt="staff" className="category-icon" />
        </div>
        <div>
          <p className="disclaimer">Indicate percentage of personnel on site.</p>
        </div>
        <div className="cards-container-categ">
          <div className="card">
            {staffTypes.map((type, ind) => {
              const { description, _id } = type;

              const worker = staff.find((e) => e._type === _id);
              const { cantidad } = worker;

              const inputProps = {
                description,
                cantidad,
                handleStaffChange,
              };
              const selectProps = {
                description,
                cantidad,
                handleStaffChange,
              };

              return ind < 2 ? (
                <StaffInput key={ind} {...inputProps} />
              ) : (
                <StaffSelect key={ind} {...selectProps} />
              );
            })}
          </div>
        </div>
        <ButtonGroup onCancel={onCancel} onSave={onSave} disabled={false} />
      </div>
    </div>
  );
};

export default Staff;
