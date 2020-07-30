import React from 'react';
import './App.css';
import {
  BrowserRouter as Router, Route, Switch, Redirect,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Login from './components/login.jsx';
import APP_URL_PATH from './constants';

function App() {
  const loggedIn = useSelector((state) => ((state.user) ? state.user.loggedIn : false));

  return (
    <React.Fragment>
      <Router>
        <Switch>
          <PrivateRoute path={APP_URL_PATH} exact>
            <h1>Home page.</h1>
          </PrivateRoute>
          <LoginRoute path={`${APP_URL_PATH}login`}>
            <Login />
          </LoginRoute>
        </Switch>
      </Router>
    </React.Fragment>
  );

  function PrivateRoute({ children, ...rest }) {
    return <Route {...rest} render={() => (loggedIn ? (children) : (<Redirect to={{ pathname: `${APP_URL_PATH}login` }} />))} />;
  }

  function LoginRoute({ children, ...rest }) {
    return <Route {...rest} render={() => (loggedIn ? (<Redirect to={{ pathname: `${APP_URL_PATH}` }} />) : (children))} />;
  }
}

App.propTypes = {
  children: PropTypes.any,
};

export default App;
