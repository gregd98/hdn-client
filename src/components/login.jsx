import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import { loadUserData, logIn } from '../actions/userActions';
import * as Constants from '../constants';
import { restGet, restPost } from '../utils/communication';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const cookies = useCookies();
  const setCookie = cookies[1];
  const removeCookie = cookies[2];

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    restGet(`${Constants.SERVER_PATH}api/userData`, dispatch, removeCookie).then((result) => {
      dispatch(logIn());
      dispatch(loadUserData(result));
    });
  }, [dispatch, removeCookie]);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const loginClicked = (event) => {
    event.preventDefault();
    setBtnDisabled(true);
    restPost(`${Constants.SERVER_PATH}api/login`, { username, password }, dispatch, removeCookie).then(() => {
      setCookie('loggedin', '1', { path: '/' });
      dispatch(logIn());
    }).catch((error) => {
      setBtnDisabled(false);
      setErrorMessage(error.message);
    });
  };

  const registerClicked = () => {
    history.push(`${Constants.APP_URL_PATH}registration`);
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
        <button onClick={registerClicked} type="button" className="btn btn-link">Sign Up</button>
      </form>
      {errorMessage && <div className="alert alert-danger mt-5" role="alert">{errorMessage}</div>}
    </div>
  );
};

export default Login;
