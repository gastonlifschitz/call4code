import React, { Component, Fragment } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import DashboardColumna from "./DashboardColumna";

import { getDashboard } from "../../services/apiService";
import { dashCols } from "../../config.json";

import "../../styles/dashboard/dashboard.scss";
import "../../styles/common/header.css";
import "../../styles/common/bastrap.css";

class DashboardCovid extends Component {
  state = {
    data: {},
  };

  async componentDidMount() {
    await this.initializeData();
  }

  async initializeData() {
    const { data } = await getDashboard();
    this.setState({ data });
  }

  render() {
    setInterval(async () => {
      this.initializeData();
      console.log("refresh triggred...3 minutes to next refresh from now");
    }, 1000 * 60 * 3);

    const { data } = this.state;

    if (!data.hospitals) return <span className="disclaimer">Loading...</span>;

    return (
      <Fragment>
        <Header title="Dashboard Hospitally" />
        <div className="dashboard-main">
          <div className="dashboard-container">
            {dashCols.map((col, ind) => {
              const { title, img, key } = col;
              return (
                <DashboardColumna
                  key={ind}
                  title={title}
                  img={img}
                  data={data[key]}
                />
              );
            })}
          </div>
        </div>
        <Footer />
      </Fragment>
    );
  }
}

export default DashboardCovid;
