import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Home from "./components/inspection/Home";
import Login from "./components/Login";
import InspectionOverview from "./components/inspection/InspectionOverview";
import DashboardCovid from "./components/dashboard/DashboardCovid.jsx";

import PrivateRoute from "./components/PrivateRoute";
import NotFound from "./components/NotFound";

import "./styles/common/bastrap.css";

export default function App() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/notfound" component={NotFound} />
      <PrivateRoute path="/overview" component={InspectionOverview} />
      <PrivateRoute path="/dashboard" component={DashboardCovid} />
      <PrivateRoute exact path="/" component={Home} />
      <Redirect to="login" />
    </Switch>
  );
}
