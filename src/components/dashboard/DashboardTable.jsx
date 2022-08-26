import React from "react";
import { alertCodes } from "../../config.json";
import "../../styles/common/bastrap.css";

const getFormatedCell = (cell, headers, title, col) => {
  let formatValue = parseInt(cell);
  let label = "default";
  let showPercentage = false;

  // fix for incorrect data
  if (title === "HR") {
    if (col < 2) {
      // 0 medicos 1 enfermeros
      headers = "medico";
      showPercentage = true;
      if (formatValue === 100) formatValue = 2;
      else if (formatValue >= 80) formatValue = 1;
      else if (formatValue < 80) formatValue = 0;
    } else {
      // 2 camilleros 3 admins
      headers = "default";
      formatValue = 0;
    }
  } else if (title === "INSUMOS") {
    headers = "ANY";
    if (formatValue > 4) formatValue = 5;
  } else if (title === "GESTION DE PACIENTES") {
    showPercentage = true;
    switch (col) {
      case 0:
        headers = "critical";
        formatValue = formatValue <= 3 ? 0 : 1;
        break;
      case 1:
        headers = "severe";
        formatValue = formatValue <= 7 ? 0 : 1;
        break;
      case 2:
        headers = "moderate";
        formatValue = formatValue <= 90 ? 0 : 1;
        break;

      default:
        headers = "default";
        formatValue = 0;
        showPercentage = false;
        break;
    }
  } else {
    title = "OTHER";
    headers = "default";
    formatValue = 0;
  }

  console.log(title, headers, formatValue);
  if (cell !== "-") {
    label = alertCodes[title][headers][formatValue];
  } else {
    showPercentage = false;
  }

  return (
    <div className={`txt-alert-${label}`}>
      {cell}
      {showPercentage && "%"}
    </div>
  );
};

const DashboardColumna = ({ cols, title }) => {
  console.log(cols);

  const headers = [];
  const content = [];

  cols.forEach((col) => headers.push(col[0]));
  cols.forEach((col) => content.push(col.splice(1)));

  console.log(content);

  return (
    <table className="table table-striped table-condensed table-hover">
      <thead>
        <tr>
          {headers.map((head, ind) => {
            return (
              <th key={ind} className="tab-header">
                {head}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {[...Array(content[0].length).keys()].map((row, ind) => {
          return (
            <tr key={ind}>
              {content.map((cell, ind) => {
                return (
                  <td key={ind}>
                    {getFormatedCell(cell[row], headers[row], title, ind)}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default DashboardColumna;
