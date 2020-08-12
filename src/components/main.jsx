import React, { useEffect } from 'react';
import {
  BrowserRouter as Router, Route, Switch, useRouteMatch, Link,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { logOut, fetchUserData } from '../actions/userActions';
import * as Constants from '../constants';
import Staff from './staff.jsx';
import Teams from './teams/teams.jsx';
import Team from './teams/team.jsx';
import Player from './players/player.jsx';
import Players from './players/players.jsx';
import Games from './games/games.jsx';

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
    }).then((result) => result.json()).then((result) => {
      if (result.succeed) {
        dispatch(fetchUserData(result.payload));
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
        removeCookie('loggedin', { path: '/' });
        dispatch(logOut());
      } else {
        console.log('Logout failed.');
      }
    });
  };

  return (
    <React.Fragment>
      <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link to={`${url}`} className="navbar-brand">
          <img src="logo.svg" width="30" height="30" className="d-inline-block align-top mr-3" alt="" />
          HDN
        </Link>
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
              <Link to={`${Constants.APP_URL_PATH}staff`} className="nav-link">Staff</Link>
            </li>
            <li className="nav-item">
              <Link to={`${Constants.APP_URL_PATH}games`} className="nav-link">Games</Link>
            </li>
            <li className="nav-item">
              <Link to={`${Constants.APP_URL_PATH}teams`} className="nav-link">Teams</Link>
            </li>
            <li className="nav-item">
              <Link to={`${Constants.APP_URL_PATH}players`} className="nav-link">Players</Link>
            </li>
            <li className="nav-item dropdown">
              <Link to={`${Constants.APP_URL_PATH}account`} className="nav-link dropdown-toggle" role="button" data-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">
                {`${userData.lastName} ${userData.firstName}`}
              </Link>
              <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <Link to={`${url}/account`} className="btn shadow-none dropdown-item">Account</Link>
                <button onClick={logoutClicked} className="btn shadow-none rounded-0 dropdown-item">Log Out</button>
              </div>
            </li>
          </ul>
        </div>
      </nav>
        <Switch>
          <Route exact path={`${path}`}>
            <h1>Home</h1>
          </Route>
          <Route path={`${Constants.APP_URL_PATH}staff`}>
            <Staff />
          </Route>
          <Route path={`${Constants.APP_URL_PATH}games`}>
            <Games />
          </Route>
          <Route exact path={`${Constants.APP_URL_PATH}teams`}>
            <Teams />
          </Route>
          <Route path={`${Constants.APP_URL_PATH}teams/:id`}>
            <Team />
          </Route>
          <Route exact path={`${Constants.APP_URL_PATH}players`}>
            <Players />
          </Route>
          <Route path={`${Constants.APP_URL_PATH}players/:id`}>
            <Player />
          </Route>
          <Route path={`${Constants.APP_URL_PATH}account`}>
            <h1>Account</h1>
          </Route>
          <Route path="*">
            <h3>Main error.</h3>
          </Route>
        </Switch>
      </Router>
    </React.Fragment>
  );
};

export default Main;
