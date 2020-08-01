import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import { logIn } from '../actions/userActions';
import * as Constants from '../constants';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [cookies, setCookie] = useCookies();

  const dispatch = useDispatch();

  useEffect(() => {
    fetch(`${Constants.SERVER_PATH}api/userData`, {
      method: 'GET',
      credentials: 'include',
    }).then((result) => {
      console.log(result.status);
      return result.json();
    }).then((result) => {
      if (result.succeed) {
        console.log('Login succeed.');
        dispatch(logIn(result.userData));
      }
    }).catch((error) => {
      console.log(`Error: ${error.message}`);
    });
  }, [dispatch]);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const loginClicked = (event) => {
    event.preventDefault();
    console.log(`Username: ${username}\nPassword: ${password}`);
    console.log('Login clicked.');

    setBtnDisabled(true);

    fetch(`${Constants.SERVER_PATH}api/login`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    }).then((result) => result.json()).then((result) => {
      if (result.succeed) {
        setCookie('loggedin', '1', { path: '/' });
        console.log(cookies);
        dispatch(logIn(result.userData));
      } else {
        console.log('Login failed.');
        setErrorMessage(result.message);
        setBtnDisabled(false);
      }
    }).catch((error) => {
      console.log(`Error: ${error.message}`);
      setBtnDisabled(false);
      setErrorMessage('Network error.');
    });
  };

  return (
    <div className="container col-sm-4">
      <form onSubmit={loginClicked}>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Username</label>
          <input onChange={handleUsernameChange} value={username} type="text" className="form-control" id="exampleInputEmail1" placeholder="Username" />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input onChange={handlePasswordChange} value={password} type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
        </div>
        <button type="submit" className="btn btn-primary" disabled={btnDisabled}>
          {btnDisabled && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />}
          Log In
        </button>
      </form>
      {errorMessage && <div className="alert alert-danger mt-5" role="alert">{errorMessage}</div>}
    </div>
  );
};

export default Login;
