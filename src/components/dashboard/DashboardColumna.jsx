import React from "react";
import DashboardTable from "./DashboardTable";
import "../../styles/dashboard/dashboard.scss";

export default function DashboardColumna({ title, data, img }) {
  return (
    <div className="dashboard-columna-container">
      <div className="dashboard-columna-header">
        <div className="dashboard-columna-img">
          <img src={img} alt="imagen" />
        </div>
        <div className="dashboard-columna-title">
          <h4>{title}</h4>
        </div>
      </div>
      <div className="dashboard-columna-content">
        <DashboardTable cols={data} title={title} />
      </div>
    </div>
  );
}
