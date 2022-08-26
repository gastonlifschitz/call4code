import React, { Component, Fragment } from "react";
import { Offline, Online } from "react-detect-offline";

// Custom components
import Header from "../common/Header";
import Spinner from "../common/Spinner";

// Services
import { getCurrentUser } from "../../services/authService";
import { getUserById, getHospitals } from "../../services/apiService";
import { getHospitalLastInspection } from "../../services/apiService";
import { getBedSubtotals, getBedsByHospital } from "../../services/apiService";
import { getStaffByHospital } from "../../services/apiService";
import { getTypes } from "../../services/apiService";
import { saveTransaction, saveObservation } from "../../services/apiService";

// Utilities
import { getJSONFromLocal, saveJSONToLocal } from "../../util/localStorage";
import { dayText, dayTime } from "../../util/datetime";

// Alert messages
import { exitMsg, noInternetMsg, successMsg } from "../../alerts.json";
import { pendingMsg, noPendingMsg } from "../../alerts.json";

// Styles
import "../../styles/inspection/home.scss";
import "../../styles/inspection/hospital.scss";

class Home extends Component {
  state = {
    currentUser: "",
    spinner: false,
    loading: false,
  };

  async componentDidMount() {
    await this.handlePendindTransactions();

    const { isDisconnected } = this.state;
    console.log({ isDisconnected });
    if (isDisconnected) {
      const currentState = getJSONFromLocal("homeState");
      this.setState(currentState);
      this.setState({ isDisconnected: true, spinner: false });
      console.log("disconnected state", this.state);
      return;
    }

    await this.initializeBasic();
    // Query DB only if local data isn't available.
  }

  async initializeBasic() {
    console.log("initialize Basic");
    const currentUser = getCurrentUser();
    console.log(currentUser);
    const { _id: _user, isAdmin } = currentUser;

    const response = isAdmin ? await getHospitals() : await getUserById(_user);
    const { data } = response;
    const hospitals = isAdmin ? data : data._hospital;
    console.log(data);

    if (!hospitals[0]) {
      alert("You don't have enough permissions.");
      localStorage.removeItem("covid19-token");
      window.location.reload();
    }

    const { _id: _hospital, name: hospitalName } = hospitals[0];
    let selectedHospital = hospitals[0];

    const savedData = getJSONFromLocal("hospitalData");
    if (savedData) selectedHospital = savedData.selectedHospital;

    this.setState(
      {
        _user,
        currentUser,
        _hospital,
        hospitals,
        hospitalName,
        selectedHospital,
      },
      () => {
        console.log(this.state);
      }
    );
  }

  async initializeStaffData() {
    console.log("initializeStaffData");
    const { selectedHospital } = this.state;
    const { _id: _hospital } = selectedHospital;

    const { data: staffByHospital } = await getStaffByHospital(_hospital);

    this.setState({ staffByHospital }, () => {
      console.log(this.state);
    });
  }

  async initializeBedData() {
    console.log("initializeBedData");
    const { selectedHospital } = this.state;
    const { _id: _hospital } = selectedHospital;
    const { data: respiratoryDeficiencyTypes } = await getTypes(
      "respiratoryDeficiency"
    );
    const { data: bedsByHospital } = await getBedsByHospital(_hospital);
    const { data: bedSubtotals } = await getBedSubtotals(_hospital);

    this.setState(
      { bedSubtotals, bedsByHospital, respiratoryDeficiencyTypes },
      () => {
        console.log(this.state);
      }
    );
  }

  async initializeDBTypes() {
    const { data: staffTypes } = await getTypes("staff");
    const { data: bedTypes } = await getTypes("bed");
    const { data: supplyTypes } = await getTypes("supply");
    const { data: observationTypes } = await getTypes("observation");

    this.setState({
      staffTypes,
      supplyTypes,
      bedTypes,
      observationTypes,
    });
  }

  checkInternet = async () => {
    console.log("Checking active connection for at least 2 seconds.");
    const webPing = setInterval(() => {
      fetch("//google.com", {
        mode: "no-cors",
      })
        .then(() => {
          this.setState({ isDisconnected: false, spinner: false });
          console.log("Online ...");
          return clearInterval(webPing);
        })
        .catch(() => {
          console.log("No conection available.");
          this.setState({ isDisconnected: true, spinner: false });
        });
    }, 2000);
  };

  async handlePendindTransactions() {
    // Checking Internet access

    this.checkInternet();

    const homeState = getJSONFromLocal("homeState");
    this.setState(homeState);
    this.setState({ spinner: true });

    console.log(this.state);
    const { isDisconnected } = this.state;

    const online = navigator.onLine;
    if (!online || isDisconnected) {
      alert(noInternetMsg);
      this.setState({ spinner: false, loading: false });
      return;
    }

    // Checking if there're any pending transactions.
    console.log("Checking connectivity...");
    const pendingTransactions = getJSONFromLocal("pending-transactions");
    if (!pendingTransactions) {
      console.log("No pending transactions!");
      this.setState({ spinner: false, loading: false });
      return;
    }

    // If there're pending transaction, act on them.
    let lastInspection;
    for (let transaction of pendingTransactions) {
      const body = getJSONFromLocal(transaction);
      const { data } = await saveTransaction(body);
      const { _id: _transaction, timestamp } = data;

      console.log("Transaction saved... ", _transaction);
      lastInspection = dayTime(timestamp);

      const { currentObservation } = body;

      if (currentObservation.comment) {
        currentObservation._transaction = _transaction;
        const { data: obs } = await saveObservation(currentObservation);
        const { _id: _observ } = obs;
        console.log("Observation saved... ", _observ);
      }

      // Once transaction is processed, remove from local data.
      localStorage.removeItem(transaction);
    }

    // Delete pending tasks list
    localStorage.removeItem("pending-transactions");

    // Update local bed stats.
    await this.initializeBedData();

    console.log("Data synchronized with server.");
    alert(successMsg);
    this.setState({ spinner: false, loading: false, lastInspection });
  }

  // Warn user if there are pending transactions.
  async pendingTransactions() {
    const pendingTransactions = getJSONFromLocal("pending-transactions");
    if (pendingTransactions) {
      alert(pendingMsg);
      console.log({ pendingTransactions });
    }
  }

  async handleSync() {
    console.log("handleSync");
    const pendingTransactions = getJSONFromLocal("pending-transactions");
    if (!pendingTransactions) {
      alert(noPendingMsg);
      return;
    }
    this.setState({ spinner: true });
    await this.handlePendindTransactions();
    this.setState({ spinner: false });
  }

  async lastInspectionDate(hospitalId) {
    const { data: lastInspection } = await getHospitalLastInspection(
      hospitalId
    );
    return dayTime(lastInspection);
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit");

    this.setState({ loading: true });

    // Checking internet conextion
    this.checkInternet();

    const { isDisconnected, selectedHospital } = this.state;

    const { _id: currentHospital } = selectedHospital;
    const savedData = getJSONFromLocal("hospitalData");

    let changedHospital = false;

    if (savedData) {
      const { _id: prevHospital } = savedData.selectedHospital;
      changedHospital = !(prevHospital === currentHospital);
    }

    const online = navigator.onLine;
    if (!online || isDisconnected) {
      alert(noInternetMsg);
      this.setState({ loading: false });
    }

    // If no saved data & conection, or if current hospital changed, reload data.
    if ((!savedData && !isDisconnected) || changedHospital) {
      console.log("Loading new information...");
      await this.initializeBedData();
      await this.initializeDBTypes();
      await this.pendingTransactions();
      saveJSONToLocal("hospitalData", this.state);
    }

    // Save home state before moving to another route
    saveJSONToLocal("homeState", this.state);

    this.setState({ loading: false });

    const { history } = this.props;
    history.push("/overview");
  };

  handleSelect = async (event) => {
    const { hospitals } = this.state;
    console.log(event.target.value);

    const selectedHospital = hospitals.find(
      (h) => h._id === event.target.value
    );
    const { name: hospitalName, _id: _hospital } = selectedHospital;

    let lastInspection = "-";
    try {
      lastInspection = await this.lastInspectionDate(_hospital);
    } catch (error) {
      console.log("No pending transaciont for current hospital");
    }

    this.setState(
      { selectedHospital, hospitalName, _hospital, lastInspection },
      () => console.log(this.state)
    );
  };

  render() {
    const { spinner, loading, isDisconnected } = this.state;
    const { currentUser, lastInspection } = this.state;
    const { hospitals, selectedHospital } = this.state;

    if (!hospitals || !selectedHospital || spinner) return <Spinner />;

    const { name } = currentUser;
    const { _id: selectedHospitalID } = selectedHospital;

    return (
      <Fragment>
        <div className="mobile">
          <Header title="HospitAlly" />
          <div className="content">
            <div className="row">
              <div className="col-md-12">
                <span className="text-muted date">{dayText(Date.now())}</span>
              </div>
              <h4 className="greeting">{`¡Hello ${name}!`}</h4>
            </div>

            <div className="card">
              <div className="form-group has-button">
                <label className="control-label hospital-label">
                  Please choose your institution to work with
                </label>
                <select
                  className="form-control chosen-select custom-select hospital-select"
                  data-placeholder="Choose institution"
                  onChange={(event) => this.handleSelect(event)}
                  value={selectedHospitalID}
                  disabled={isDisconnected}
                >
                  {hospitals.map((hospital, i) => {
                    const { _id, name } = hospital;
                    return (
                      <option key={_id} value={_id}>
                        {name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="last-inspection">
                <span>Last inspection</span>
                <span className="date">
                  {lastInspection ? lastInspection : " - "}
                </span>
              </div>
            </div>

            <div className="unique-btn-container">
              <button
                disabled={isDisconnected && !getJSONFromLocal("homeState")}
                onClick={(event) => this.handleSubmit(event)}
                type="button"
                className={`btn btn-primary btn-start`}
              >
                {loading
                  ? "Processing, please wait a moment..."
                  : "Initiate inspection"}
              </button>
            </div>

            <div className="connection-container">
              <div className="unique-btn-container">
                <Online>
                  <div className="connection">
                    <span className="success-dot dot-connection">·</span>
                    <span className="label-connection">
                      No network connection.
                    </span>
                  </div>
                </Online>
                <Offline>
                  <div className="connection">
                    <span className="fail-dot dot-connection">·</span>
                    <span className="label-connection">
                      Network connection unavailable.
                    </span>
                  </div>
                </Offline>
              </div>

              <div className="unique-btn-container">
                <Online>
                  <button
                    type="button"
                    onClick={() => this.handleSync()}
                    className="btn btn-sec"
                  >
                    Synchronize
                  </button>
                </Online>
              </div>

              <div className="unique-btn-container">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(exitMsg)) {
                      localStorage.removeItem("hospitalData");
                      localStorage.removeItem("homeState");
                      localStorage.removeItem("covid19-token");
                      window.location.reload();
                    }
                  }}
                  className="btn btn-sec"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Home;
