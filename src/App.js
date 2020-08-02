import React from 'react';
import './App.css';
import {
  BrowserRouter as Router, Route, Switch, Redirect,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';
import Login from './components/login.jsx';
import Registration from './components/registration.jsx';
import * as Constants from './constants';
import Main from './components/main.jsx';

function App() {
  const loggedIn = useSelector((state) => state.user.loggedIn);

  return (
    <React.Fragment>
      <Router>
        <Switch>
          <PrivateRoute path={`${Constants.APP_URL_PATH}home`}>
            <Main />
          </PrivateRoute>
          <PublicRoute path={`${Constants.APP_URL_PATH}login`}>
            <Login />
          </PublicRoute>
          <PublicRoute path={`${Constants.APP_URL_PATH}registration`}>
            <Registration />
          </PublicRoute>
        </Switch>
      </Router>
    </React.Fragment>
  );

  function PrivateRoute({ children, ...rest }) {
    const [cookies] = useCookies(['loggedin']);
    return <Route {...rest} render={() => ((cookies.loggedin === '1' || loggedIn) ? (children) : (<Redirect to={{ pathname: `${Constants.APP_URL_PATH}login` }} />))} />;
  }

  function PublicRoute({ children, ...rest }) {
    return <Route {...rest} render={() => (loggedIn ? (<Redirect to={{ pathname: `${Constants.APP_URL_PATH}home` }} />) : (children))} />;
  }
}

App.propTypes = {
  children: PropTypes.any,
};

export default App;
