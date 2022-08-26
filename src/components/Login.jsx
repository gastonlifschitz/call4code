import React, { Component } from "react";
import Joi from "joi-browser";
import { Redirect } from "react-router-dom";
import { login, getCurrentUser } from "../services/authService";
import { badPassword } from "../errors.json";

import logo from "../images/logo.png";
import hospitAlly from "../images/hospitalally.png";
import "../styles/login.scss";

class Login extends Component {
  state = {
    data: {
      username: "",
      password: "",
    },
    errors: {
      username: false,
      password: false,
    },
    currentUser: "",
    forgot: {
      submitting: false,
      success: false,
    },
    error: { title: "", subtitle: "" },
  };

  handleSubmit = async (e) => {
    const { username, password } = this.state.data;
    e.preventDefault();

    try {
      await login(username, password);
      const { state } = this.props.location;
      window.location = state ? state.from.pathname : "/";
    } catch (ex) {
      const error = ex.response ? ex.response.data : ex.response;
      console.log("handleSubmit", error);
      alert(error);
      this.setState({ error: badPassword });
    }
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(
      this.state.data,
      this.validationSchema,
      options
    );
    if (!error) return null;
    console.log(error.message);
    return error;
  };

  validationSchema = {
    username: Joi.string().regex(RegExp("^[0-9]+$")).required(),
    password: Joi.string().min(3).max(30),
  };

  validateProperty = ({ id, value }) => {
    const obj = { [id]: value };
    const propSchema = { [id]: this.validationSchema[id] };
    return Joi.validate(obj, propSchema).error ? true : false;
  };

  handleChange = (input) => {
    const data = { ...this.state.data };
    const errors = { ...this.state.errors };
    data[input.target.id] = input.target.value;
    errors[input.target.id] = this.validateProperty(input.target);
    this.setState({ data, errors });
  };

  resetError = () => {
    this.setState({ error: { title: "", subtitle: "" } });
  };

  render() {
    if (getCurrentUser()) return <Redirect to="/" />;
    const { username, password } = this.state.data;

    return (
      <div className="mobile">
        <div className="content login">
          <div className="col-md-12">
            <img src={logo} alt="BA" className="logo-ba" />
          </div>
          <div className="col-md-12">
            <img src={hospitAlly} alt="BA" className="" />
          </div>
          <p className="text-muted">I forgot my password</p>
          <form className="form-login" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <input
                type="number"
                className="form-control"
                id="username"
                placeholder="type you ID here"
                onChange={(event) => this.handleChange(event)}
                value={username}
                autoComplete="username"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="type your password here"
                onChange={(event) => this.handleChange(event)}
                value={password}
                required
              />
            </div>
            <button
              disabled={this.validate() ? true : false}
              type="submit"
              className="btn btn-primary"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
