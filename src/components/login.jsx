import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logIn } from '../actions/userActions';

class Login extends Component {
  _isMounted = false;

  state = { username: '', password: '', btnDisabled: false };

  render() {
    return (
      <div className="container col-sm-3">
        <form onSubmit={this.loginClicked}>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Username</label>
            <input onChange={this.usernameChanged} value={this.state.username} type="text" className="form-control" id="exampleInputEmail1" placeholder="Username" />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input onChange={this.passwordChanged} value={this.state.password} type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
          </div>
          <button type="submit" className="btn btn-primary" disabled={this.state.btnDisabled}>Log In</button>
        </form>
      </div>
    );
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  usernameChanged = (event)  => {
    this.setState({ username: event.target.value });
  }

  passwordChanged = (event)  => {
    this.setState({ password: event.target.value });
  }

  loginClicked = (event) => {
    event.preventDefault();
    console.log(`Username: ${this.state.username}\nPassword: ${this.state.password}`);
    console.log('Login clicked.');

    this.setState({ btnDisabled: true });

    fetch('http://localhost/api/login', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ username: this.state.username, password: this.state.password }),
    }).then((result) => result.json()).then((result) => {
      if (result.succeed) {
        console.log('Login succeed.');
        console.log(result);
        this.props.logIn(result.userData);
      } else {
        console.log('Login failed.');
      }
      if (this._isMounted) {
        this.setState({ btnDisabled: false });
      }
    }).catch((error) => {
      console.log(`Error: ${error.message}`);
      this.setState({ btnDisabled: false });
    });
  }
}

Login.propTypes = {
  logIn: PropTypes.func,
};

const bindAppStateToProps = (appState) => ({ loggedIn: appState.user.loggedIn });
const bindDispatchToProps = (dispatch) => bindActionCreators({ logIn }, dispatch);
export default connect(bindAppStateToProps, bindDispatchToProps)(Login);
