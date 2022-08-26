// React Components
import React, { Component, Fragment } from "react";
import uuid from "react-uuid";
import Header from "../common/Header";
import Spinner from "../common/Spinner";
import Supplies from "../inspection/Supplies";
import Beds from "../inspection/Beds";
import RespiratoryDeficiencies from "./RespiratoryDeficiencies";
import Staff from "../inspection/Staff";
import Observations from "./Observations";

// Utilities
import { getJSONFromLocal, saveJSONToLocal } from "../../util/localStorage";
import { dynamicSort, isNumber } from "../../util/util";

// Configs
import { screenStates } from "../../config.json";

// Alert messages
import { cancelMsg, submitMsg } from "../../alerts.json";

// Media
import lifeIcon from "../../images/life.svg";
import bedIcon from "../../images/bed.svg";
import doctorIcon from "../../images/doctor.svg";
import reportIcon from "../../images/report.svg";

// Styles
import "../../styles/inspection/inspectionOverview.scss";

class InspectionOverview extends Component {
  state = {
    currentTransaction: {
      _hospital: "",
      _user: "",
      staff: [],
      supplies: [],
      respiratoryDeficiencies: [],
      beds: [],
    },
    currentHospitalName: "",
    currentObservation: {
      _type: "",
      _transaction: "",
      _user: "",
      comment: "",
    },
    screen: screenStates.default,
  };

  async componentDidMount() {
    await this.initializeHospitalData();
    await this.initializeTransaction();
    this.initializeComponents();
    this.resetBedForm();

    saveJSONToLocal("currentTransaction", this.state);
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener("popstate", function (event) {
      window.history.pushState(null, document.title, window.location.href);
    });
  }

  restorePreviousState = () => {
    console.log("Cancelling state...");
    const prevState = getJSONFromLocal("currentTransaction");
    prevState.screen = 0;
    this.setState(prevState);
  };

  initializeHospitalData() {
    const hospitalData = getJSONFromLocal("hospitalData");
    saveJSONToLocal("initHospitalData", hospitalData);
    this.setState({ ...hospitalData }, () => {
      console.log("initializeHospitalData...");
      this.updateBedTotals();
    });
  }

  initializeComponents() {
    const { bedsByHospital } = this.state;
    const salas = Array.from(new Set(bedsByHospital.map((b) => b.sala)));
    this.setState({ salas });
  }

  async initializeTransaction() {
    const { _hospital, _user } = this.state;
    const { supplyTypes, staffTypes, respiratoryDeficiencyTypes } = this.state;

    const supplies = [];
    supplyTypes.forEach((type) => {
      supplies.push({
        _hospital,
        _type: type._id,
        dias: "",
      });
    });

    const beds = [];

    const respiratoryDeficiencies = [];
    respiratoryDeficiencyTypes.forEach((type) => {
      respiratoryDeficiencies.push({
        _hospital,
        _type: type._id,
        cantidad: "-",
      });
    });
    const staff = [];
    staffTypes.forEach((type) => {
      staff.push({
        _hospital,
        _type: type._id,
        cantidad: "",
      });
    });

    const observations = [];

    const currentObservation = {
      _type: "",
      _transaction: "",
      _user,
      comment: "",
    };

    const currentTransaction = {
      _hospital,
      _user,
      staff,
      supplies,
      beds,
      respiratoryDeficiencies,
    };

    this.setState({
      currentTransaction,
      currentObservation,
      observations,
    });
  }

  setScreen = (screen) => {
    this.setState({
      screen,
    });
  };

  handleSupplyChange = (event) => {
    const { currentTransaction } = this.state;
    const { supplies, _hospital } = currentTransaction;
    const { id, value } = event.target;

    const newSupply = {
      _hospital,
      _type: id,
      dias: value,
    };

    const newSupplies = supplies.filter((sup) => sup._type !== newSupply._type);
    newSupplies.push(newSupply);
    newSupplies.sort();
    currentTransaction.supplies = newSupplies.sort(dynamicSort("_type"));

    this.setState({ currentTransaction });
  };

  handleRespiratoryDeficiencyChange = (event) => {
    const { currentTransaction } = this.state;
    const { respiratoryDeficiencies, _hospital } = currentTransaction;
    const { id, value } = event.target;

    if (
      parseInt(value) > 100 &&
      !["5e8250824753a3a6c9e4b29c", "5e8250864753a3a6c9e4b29d"].includes(id)
    ) {
      alert("Value can't be greater than 100.");
      return;
    }

    const newRespiratoryDeficiency = {
      _hospital,
      _type: id,
      cantidad: value,
    };

    const newRespiratoryDeficiencies = respiratoryDeficiencies.filter(
      (obj) => obj._type !== newRespiratoryDeficiency._type
    );
    newRespiratoryDeficiencies.push(newRespiratoryDeficiency);
    newRespiratoryDeficiencies.sort();
    currentTransaction.respiratoryDeficiencies = newRespiratoryDeficiencies.sort(
      dynamicSort("_type")
    );

    this.setState({ currentTransaction });
  };

  handleRespiratoryDeficiencySave = () => {
    console.log("handleRespiratoryDeficiencySave triggered...");
    this.setState({ screen: 0 }, () => {
      saveJSONToLocal("currentTransaction", this.state);
    });
  };

  handleRespiratoryDeficiencyCancel = () => {
    this.restorePreviousState();
  };

  handleSupplySave = () => {
    console.log("handleSupplySave triggered...");
    this.setState({ screen: 0 }, () => {
      saveJSONToLocal("currentTransaction", this.state);
    });
  };

  handleSupplyCancel = () => {
    this.restorePreviousState();
  };

  handleObservationChange = (event) => {
    const { value, id } = event.target;
    const { currentObservation } = this.state;

    currentObservation[id] = value;

    this.setState({ currentObservation }, () => {
      console.log(this.state);
    });
  };

  handleObservationCancel = () => {
    this.restorePreviousState();
  };

  handleObservationSave = () => {
    const { currentObservation } = this.state;
    const { _type, comment } = currentObservation;

    if (_type === "" || comment === "") {
      alert("Please, complete both fields.");
      return;
    }
    saveJSONToLocal("currentTransaction", this.state);
    this.setScreen(0);
  };

  handleStaffCancel = () => {
    this.restorePreviousState();
  };

  handleStaffSave = () => {
    console.log("handleStaffSave triggered...");
    saveJSONToLocal("currentTransaction", this.state);
    this.setScreen(0);
  };

  handleStaffChange = (event) => {
    const { value, id } = event.target;

    if (parseInt(value) > 100) {
      alert("Value can't be greater than 100");
      return;
    }

    const { currentTransaction, staffTypes } = this.state;
    const { staff } = currentTransaction;

    const { _id } = staffTypes.find((type) => type.description === id);
    const index = staff.findIndex((x) => x._type === _id);

    staff[index].cantidad = parseInt(value);

    currentTransaction.staff = staff;

    this.setState({ currentTransaction }, () => {
      console.log(this.state);
    });
  };

  resetBedForm = () => {
    console.log("resetBedForm triggered");
    const { salas } = this.state;
    const event = {
      target: {
        value: salas[0],
      },
    };

    const currentSala = { ocupadas: "", supernumerarias: "" };
    this.setState({ currentSala, editMode: false }, () => {
      console.log("resetBedForm", currentSala);
      this.handleBedsSelect(event, true);
    });
  };

  handleBedsSelect = (event, reset) => {
    console.log("handleBedsSelect triggered");
    const { bedsByHospital, currentTransaction } = this.state;
    const { beds } = currentTransaction;
    let { currentSala } = this.state;
    let { ocupadas, supernumerarias } = currentSala;

    const sala = event.target.value;

    const { cantidad: existentes } = bedsByHospital.find(
      (bed) => bed.sala === sala && bed._type.description === "existentes"
    );

    const { cantidad: disponibles } = bedsByHospital.find(
      (bed) => bed.sala === sala && bed._type.description === "disponibles"
    );

    const prev = beds.filter((bed) => bed.sala === sala);

    ocupadas = prev[0] ? prev[0].ocupadas : "";
    supernumerarias = prev[0] ? prev[0].supernumerarias : "";

    currentSala = {
      sala,
      existentes,
      disponibles,
      ocupadas: reset ? "" : ocupadas,
      supernumerarias: reset ? "" : supernumerarias,
    };

    this.setState(() => {
      console.log("handleBedsSelect", currentSala);
      return { currentSala };
    });
  };

  handleBedsInput = ({ currentTarget: input }) => {
    const { currentSala } = this.state;
    const { existentes } = currentSala;

    if (input.id === "ocupadas" && parseInt(input.value) > existentes) {
      alert("Value can't be greater than beds available.");
      return;
    }
    currentSala[input.id] = input.value;

    this.setState(() => {
      return { currentSala };
    });

    console.log(this.state);
  };

  handleStaffInputs = ({ currentTarget: input }) => {
    const { currentSala } = this.state;
    const { existentes } = currentSala;

    if (input.id === "ocupadas" && parseInt(input.value) > existentes) {
      alert("Value can't be greater than beds available.");
      return;
    }
    currentSala[input.id] = input.value;

    this.setState(() => {
      return { currentSala };
    });

    console.log(this.state);
  };

  updateBedTotals = () => {
    const { currentTransaction, bedsByHospital } = this.state;
    const { beds } = currentTransaction;
    let { bedSubtotals } = this.state;

    //Actualizo tabla de camas con los cambios.
    const types = ["ocupadas", "disponibles", "supernumerarias"];

    for (let bed of beds) {
      for (let type of types) {
        const index = bedsByHospital.findIndex(
          (e) => e.sala === bed.sala && e._type.description === type
        );

        if (isNumber(bed[type]))
          bedsByHospital[index].cantidad = parseInt(bed[type]);
      }
    }

    for (let type of types) {
      let total = 0;
      for (let bed of bedsByHospital) {
        if (bed._type.description === type && parseInt(bed.cantidad))
          total += bed.cantidad;
      }

      const index = bedSubtotals.findIndex((bed) => bed.description === type);
      bedSubtotals[index].subTotals = total;
    }

    this.setState(() => {
      console.log("Updating totals to work offline");
      const hospitalData = getJSONFromLocal("hospitalData");
      hospitalData.bedsByHospital = bedsByHospital;
      hospitalData.bedSubtotals = bedSubtotals;
      saveJSONToLocal("hospitalData", hospitalData);
      return { bedSubtotals };
    });
  };

  getBedValue = (type, sala) => {
    const { bedsByHospital } = this.state;

    const index = bedsByHospital.findIndex(
      (bed) => bed._type.description === type && bed.sala === sala
    );

    return bedsByHospital[index].cantidad;
  };

  handleBedsSave = () => {
    console.log("handleBedsSave triggered ...");
    const { currentSala, currentTransaction } = this.state;
    const { sala, disponibles } = currentSala;
    const { beds } = currentTransaction;
    let { editMode } = this.state;
    let { ocupadas } = currentSala;

    const existentes = this.getBedValue("existentes", sala);

    currentSala.disponibles = isNumber(ocupadas)
      ? existentes - parseInt(ocupadas)
      : disponibles;

    const prevSalaIndex = beds.findIndex((bed) => bed.sala === sala);

    if (prevSalaIndex !== -1) {
      beds[prevSalaIndex] = currentSala;
      editMode = true;
    } else beds.push(currentSala);

    currentTransaction.beds = beds;

    this.setState({ currentTransaction, screen: 0, editMode }, () => {
      console.log(currentTransaction);
      saveJSONToLocal("currentTransaction", this.state);
    });

    this.updateBedTotals();
  };

  handleBedsCancel = () => {
    this.restorePreviousState();
  };

  renderBeds = (bedSubtotals, bedTypes) => {
    return bedTypes.map((type) => {
      const { description, _id } = type;

      const { selectedHospital } = this.state;
      const { institutionType } = selectedHospital;

      // Fix to be corrected on supernumerarias table
      if (description === "supernumerarias" && institutionType === "Hotel")
        return "";

      const index = bedSubtotals.findIndex(
        (bed) => bed.description === description
      );
      const { subTotals } = bedSubtotals[index];

      return (
        <div className="group" key={_id}>
          <span className="quantity">{subTotals}</span>
          <span className="clarification">{description}</span>
        </div>
      );
    });
  };

  renderRespiratoryDeficiencies = (
    respiratoryDeficiencies,
    respiratoryDeficiencyTypes
  ) => {
    return respiratoryDeficiencies.map((sup, key) => {
      const { cantidad, _type } = sup;
      const { description } = respiratoryDeficiencyTypes.find(
        (e) => e._id === _type
      );

      return (
        <div className="group" key={key}>
          <span
            className={`${
              !["alta", "fallecido"].includes(description)
                ? isNumber(cantidad)
                  ? "p-input"
                  : "quantity"
                : "quantity"
            } `}
          >
            {cantidad}
          </span>
          <span className="clarification">{description.substring(0, 12)}</span>
        </div>
      );
    });
  };

  renderSupplies = (supplies, supplyTypes) => {
    return supplies.map((sup, key) => {
      const { dias, _type } = sup;
      const { description } = supplyTypes.find((e) => e._id === _type);
      return (
        <div className="supply" key={key}>
          <span className={"quantity"}>{isNumber(dias) ? dias : "-"}</span>
          <span className="supply-name">{description}</span>
        </div>
      );
    });
  };

  renderStaffs = (staff, staffTypes) => {
    return staffTypes.map((type, ind) => {
      const { _id, description } = type;

      const index = staff.findIndex((s) => s._type === _id);
      const { cantidad } = index > -1 ? staff[index] : "-";

      return (
        <div className="group" key={ind}>
          <span
            className={`${
              ["medico", "enfermero"].includes(description)
                ? cantidad
                  ? "percentage-input"
                  : "quantity"
                : "quantity"
            } `}
          >
            {isNumber(cantidad) ? cantidad : "-"}
          </span>
          <span className="clarification">{description}</span>
        </div>
      );
    });
  };

  handleSaveTransaction = () => {
    console.log("Saving to local storage.");

    // Map data to transaction data structure
    const {
      currentTransaction,
      currentObservation,
      bedTypes,
      bedsByHospital,
    } = this.state;
    const { _hospital } = currentTransaction;
    const {
      beds,
      supplies,
      staff,
      respiratoryDeficiencies,
    } = currentTransaction;

    let filteredBeds = [];
    for (let bed of beds) {
      const types = ["ocupadas", "disponibles", "supernumerarias"];

      for (let type of types) {
        const indexId = bedsByHospital.findIndex(
          (b) => b._type.description === type && b.sala === bed.sala
        );

        const indexType = bedTypes.findIndex((b) => b.description === type);

        // const cantidad = parseInt(bed[type]);
        // const isNaN = Number.isNaN(cantidad);
        console.log(bed[type], isNumber(bed[type]));
        isNumber(bed[type]) &&
          filteredBeds.push({
            _id: bedsByHospital[indexId]._id,
            _type: bedTypes[indexType]._id,
            _hospital,
            pabellon: "",
            piso: "",
            sala: bed.sala,
            cantidad: bed[type],
          });
      }
    }

    console.log({ filteredBeds });

    const filteresSupplies = supplies.filter((supply) => isNumber(supply.dias));

    const filteredStaff = staff.filter((st) => isNumber(st.cantidad));
    const filteredRD = respiratoryDeficiencies.filter((rd) =>
      isNumber(rd.cantidad)
    );

    currentTransaction.staff = filteredStaff;
    currentTransaction.supplies = filteresSupplies;
    currentTransaction.beds = filteredBeds;
    currentTransaction.respiratoryDeficiencies = filteredRD;
    currentTransaction.timestamp = Date.now();

    const UUID = uuid();
    saveJSONToLocal(UUID, { currentTransaction, currentObservation });

    const pendingTransactions = getJSONFromLocal("pending-transactions") || [];
    pendingTransactions.push(UUID);
    saveJSONToLocal("pending-transactions", pendingTransactions);

    // cleanup local state.
    localStorage.removeItem("currentTransaction");
    localStorage.removeItem("initHospitalData");

    this.setState({ screen: 0 });
    const { history } = this.props;
    history.push("/");
  };

  render() {
    // States for supply
    const {
      supplyTypes,
      staffTypes,
      bedTypes,
      observationTypes,
      respiratoryDeficiencyTypes,
    } = this.state;

    // General states
    const { currentTransaction, currentObservation } = this.state;
    const { screen, hospitalName, selectedHospital } = this.state;

    // Beds states
    const { bedSubtotals } = this.state;
    const { currentSala, salas } = this.state;

    // Do not render until all information is available, show spinner instead.
    if (
      !bedTypes ||
      !supplyTypes ||
      !staffTypes ||
      !observationTypes ||
      !bedSubtotals
    )
      return <Spinner />;

    const { supplies, staff, respiratoryDeficiencies } = currentTransaction;
    const { comment } = currentObservation;

    if (screen === screenStates.supplies)
      return (
        <Supplies
          supplies={supplies}
          supplyTypes={supplyTypes}
          onSave={this.handleSupplySave}
          onCancel={this.handleSupplyCancel}
          handleChange={this.handleSupplyChange}
        />
      );

    if (screen === screenStates.beds)
      return (
        <Beds
          salas={salas}
          currentSala={currentSala}
          handleBedsInput={this.handleBedsInput}
          handleBedsSelect={this.handleBedsSelect}
          onCancel={this.handleBedsCancel}
          onSave={this.handleBedsSave}
        />
      );

    if (screen === screenStates.respiratoryDeficiencies)
      return (
        <RespiratoryDeficiencies
          onSave={this.handleRespiratoryDeficiencySave}
          respiratoryDeficiencyTypes={respiratoryDeficiencyTypes}
          data={respiratoryDeficiencies}
          handleChange={this.handleRespiratoryDeficiencyChange}
          onCancel={this.handleRespiratoryDeficiencyCancel}
        />
      );
    if (screen === screenStates.staff)
      return (
        <Staff
          staff={staff}
          staffTypes={staffTypes}
          onCancel={this.handleStaffCancel}
          onSave={this.handleStaffSave}
          handleStaffChange={this.handleStaffChange}
        />
      );

    if (screen === screenStates.observations)
      return (
        <Observations
          observationTypes={observationTypes}
          currentObservation={currentObservation}
          onCancel={this.handleObservationCancel}
          onSave={this.handleObservationSave}
          handleObservationChange={this.handleObservationChange}
          onCommentChange={this.commentChange}
        />
      );

    return (
      <div className="mobile">
        <Header title={"Active Inspection"} />

        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <span className="text-muted hospital-name">{hospitalName}</span>
              <div className="overview-subtitle">
                <span className="disclaimer">
                  Click over category to assess.
                </span>
              </div>
            </div>
          </div>
          <br />
          <div className="cards-container">
            <div
              className="card"
              onClick={(event) => this.setScreen(screenStates.supplies)}
            >
              <div className="card-header">
                <h4 className="card-title">Supply</h4>
                <img src={lifeIcon} alt="supply" className="icon" />
              </div>
              <div className="row supplies">
                {this.renderSupplies(supplies, supplyTypes)}
              </div>
            </div>

            <div
              className="card"
              onClick={(event) => this.setScreen(screenStates.beds)}
            >
              <div className="card-header">
                <h4 className="card-title">Beds</h4>
                <img src={bedIcon} alt="bed" className="icon" />
              </div>
              <div className="row beds">
                {this.renderBeds(bedSubtotals, bedTypes)}
              </div>
            </div>
            {(!selectedHospital.institutionType ||
              selectedHospital.institutionType !== "Hotel") && (
              <Fragment>
                <div
                  className="card"
                  onClick={(event) => this.setScreen(screenStates.staff)}
                >
                  <div className="card-header">
                    <h4 className="card-title">Staff</h4>
                    <img src={doctorIcon} alt="supply" className="icon" />
                  </div>
                  <div className="row staff">
                    {this.renderStaffs(staff, staffTypes)}
                  </div>
                </div>
                <div
                  className="card"
                  onClick={(event) =>
                    this.setScreen(screenStates.respiratoryDeficiencies)
                  }
                >
                  <div className="card-header">
                    <h4 className="card-title">Critical Patients</h4>
                    <img src={reportIcon} alt="bed" className="icon" />
                  </div>
                  <div className="row respiratory">
                    {this.renderRespiratoryDeficiencies(
                      respiratoryDeficiencies,
                      respiratoryDeficiencyTypes
                    )}
                  </div>
                </div>
              </Fragment>
            )}
            <div className="card card-opt">
              <div className="card-header">
                <h4 className="card-title">Observations</h4>
                <span className="label label-default label-obs">Optional</span>
              </div>
              <div className="row">
                {}
                <p className={`observation-text ${comment ? "italic" : ""}`}>
                  {comment ? comment : "No comments yet."}
                </p>
              </div>
              <div className="unique-btn-container">
                <button
                  className="btn btn-secondary btn-obs"
                  onClick={(event) => this.setScreen(screenStates.observations)}
                >
                  Add observation
                </button>
              </div>
            </div>

            <div className="unique-btn-container">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(submitMsg)) {
                    this.handleSaveTransaction();
                  }
                }}
                className="btn btn-primary"
              >
                End Inspection
              </button>
            </div>
            <div className="unique-btn-container">
              <button
                onClick={() => {
                  if (window.confirm(cancelMsg)) {
                    // localStorage.removeItem("hospitalData");
                    localStorage.removeItem("currentTransaction");

                    //restore bed subtotals,
                    const initHospitalData = getJSONFromLocal(
                      "initHospitalData"
                    );

                    saveJSONToLocal("hospitalData", initHospitalData);
                    localStorage.removeItem("initHospitalData");

                    const { history } = this.props;
                    history.push("/");
                  }
                }}
                type="button"
                className="btn btn-inverse"
              >
                Cancel Inspection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default InspectionOverview;
