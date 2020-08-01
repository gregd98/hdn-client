import React, { useEffect } from 'react';
import {
  BrowserRouter as Router, Route, Switch, useRouteMatch, Link,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { logOut, fetchUserData } from '../actions/userActions';
import * as Constants from '../constants';

const Main = () => {
  const userData = useSelector((state) => state.user.userData);
  const { path, url } = useRouteMatch();
  const dispatch = useDispatch();

  const cookies = useCookies();
  const removeCookie = cookies[2];

  useEffect(() => {
    fetch(`${Constants.SERVER_PATH}api/userData`, {
      method: 'GET',
      credentials: 'include',
    }).then((result) => {
      console.log(result.status);
      return result.json();
    }).then((result) => {
      if (result.succeed) {
        console.log('User data fetched.');
        dispatch(fetchUserData(result.userData));
      } else if (!result.authenticated) {
        removeCookie('loggedin', { path: '/' });
        dispatch(logOut());
      } else {
        console.log('Internal server error.');
      }
    }).catch((error) => {
      console.log(`Error: ${error.message}`);
    });
  }, [dispatch, removeCookie]);

  const logoutClicked = () => {
    fetch(`${Constants.SERVER_PATH}api/logout`, {
      method: 'GET',
      credentials: 'include',
    }).then((result) => result.json()).then((result) => {
      console.log(result);
      if (result.succeed) {
        console.log('Logout succeed.');
        dispatch(logOut());
      } else {
        console.log('Logout failed.');
      }
    });
  };

  return (
    <React.Fragment>
      <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link to={`${url}`} className="navbar-brand">HDN</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02"
                aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
            <li className="nav-item">
              <Link to={`${url}`} className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to={`${url}/games`} className="nav-link">Games</Link>
            </li>
            <li className="nav-item">
              <Link to={`${url}/teams`} className="nav-link">Teams</Link>
            </li>
            <li className="nav-item dropdown">
              <Link to={`${url}/account`} className="nav-link dropdown-toggle" role="button" data-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">
                {`${userData.lastName} ${userData.firstName}`}
              </Link>
              <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <Link to={`${url}/account`} className="dropdown-item">Account</Link>
                <button  onClick={logoutClicked} className="dropdown-item">Log Out</button>
              </div>
            </li>
          </ul>
        </div>
      </nav>
        <Switch>
          <Route exact path={`${path}`}>
            <h1>Fuck you</h1>
          </Route>
          <Route path={`${path}/games`}>
            <h1>Games</h1>
          </Route>
          <Route path={`${path}/teams`}>
            <h1>Teams</h1>
          </Route>
          <Route path={`${path}/account`}>
            <h1>Account</h1>
          </Route>
        </Switch>
      </Router>
    </React.Fragment>
  );
};

export default Main;
