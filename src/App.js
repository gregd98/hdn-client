import React from 'react';
import './App.css';
import {
  BrowserRouter as Router, Route, Switch, Redirect,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
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
          <PublicRoute path={`${Constants.APP_URL_PATH}login`}>
            <Login />
          </PublicRoute>
          <PublicRoute path={`${Constants.APP_URL_PATH}registration`}>
            <Registration />
          </PublicRoute>
          <PrivateRoute path={`${Constants.APP_URL_PATH}`}>
            <Main />
          </PrivateRoute>
          <Route exact path="/">
            <Redirect to={`${Constants.APP_URL_PATH}`} />
          </Route>
          <PublicRoute path="*">
            <Redirect to={`${Constants.APP_URL_PATH}`} />
          </PublicRoute>
        </Switch>
      </Router>
    </React.Fragment>
  );

  function PrivateRoute(input) {
    const { children, ...rest } = input;
    const [cookies] = useCookies(['loggedin']);
    return <Route {...rest} render={() => ((cookies.loggedin === '1' || loggedIn) ? (children) : (<Redirect to={{ pathname: `${Constants.APP_URL_PATH}login` }} />))} />;
  }

  function PublicRoute(input) {
    const { children, ...rest } = input;
    return <Route {...rest} render={() => (loggedIn ? (<Redirect to={{ pathname: `${Constants.APP_URL_PATH}` }} />) : (children))} />;
  }
}

export default App;

// TODO signupnal hibak, visszajelzesek
