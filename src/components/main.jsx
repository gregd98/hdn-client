import React, { useEffect } from 'react';
import {
  BrowserRouter as Router, Route, Switch, useRouteMatch, Link,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { logOut, loadUserData, loadPermissions } from '../actions/userActions';
import * as Constants from '../constants';
import Staff from './staff/staff.jsx';
import Teams from './teams/teams.jsx';
import Team from './teams/team.jsx';
import Player from './players/player.jsx';
import Players from './players/players.jsx';
import Games from './games/games.jsx';
import Game from './games/game.jsx';
import GameForm from './games/game_form.jsx';
import { restGet } from '../utils/communication';
import Scores from './games/scores.jsx';
import ScoreTable from './score_table.jsx';
import Invitations from './invitations.jsx';
import Events from './events.jsx';

const Main = () => {
  const userData = useSelector((state) => state.user.userData);
  const userPermissions = useSelector((state) => state.user.permissions);
  const loggedIn = useSelector((state) => state.user.loggedIn);
  const { path, url } = useRouteMatch();
  const dispatch = useDispatch();

  const cookies = useCookies();
  const removeCookie = cookies[2];

  useEffect(() => {
    restGet(`${Constants.SERVER_PATH}api/userData`, dispatch, removeCookie).then((result) => {
      dispatch(loadUserData(result));
    }).then(() => restGet(`${Constants.SERVER_PATH}api/userPermissions`, dispatch, removeCookie))
      .then((result) => {
        dispatch(loadPermissions(result));
      })
      .catch((error) => {
        console.log(`Error: ${error.message}`);
      });
  }, [dispatch, removeCookie, loggedIn]);

  const logoutClicked = () => {
    restGet(`${Constants.SERVER_PATH}api/logout`, dispatch, removeCookie).then(() => {
      removeCookie('loggedin', { path: '/' });
      dispatch(logOut());
    }).catch((error) => {
      console.log(`Error: ${error.message}`);
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
            <NavbarItem to={`${url}`} title="Home" />
            <NavbarItem to={`${Constants.APP_URL_PATH}games`} title="Games" />
            <NavbarItem to={`${Constants.APP_URL_PATH}staff`} title="Staff" />
            {userPermissions.includes(Constants.PERM_TEAMS_DATA_ACCESS) && (
              <React.Fragment>
                <NavbarItem to={`${Constants.APP_URL_PATH}teams`} title="Teams" />
                <NavbarItem to={`${Constants.APP_URL_PATH}players`} title="Players" />
              </React.Fragment>
            )}
            {(userPermissions.includes(Constants.PERM_CONTENT_ADMIN)
              || userPermissions.includes(Constants.PERM_SYSTEM_ADMIN)) && (
              <li className="nav-item dropdown">
                <button className="btn btn-link nav-link dropdown-toggle shadow-none" data-toggle="dropdown">
                  Admin tools
                </button>
                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                  <Link to={`${Constants.APP_URL_PATH}scores`} className="btn shadow-none dropdown-item">Score table</Link>
                  {userPermissions.includes(Constants.PERM_SYSTEM_ADMIN) && (
                    <React.Fragment>
                      <Link to={`${Constants.APP_URL_PATH}users`} className="btn shadow-none dropdown-item">Users</Link>
                      <Link to={`${Constants.APP_URL_PATH}roles`} className="btn shadow-none dropdown-item">Roles</Link>
                      <Link to={`${Constants.APP_URL_PATH}events`} className="btn shadow-none dropdown-item">Events</Link>
                      <Link to={`${Constants.APP_URL_PATH}invitations`} className="btn shadow-none dropdown-item">Invitations</Link>
                    </React.Fragment>
                  )}
                </div>
              </li>
            )}
          </ul>
          <ul className="navbar-nav mt-2 mt-lg-0">
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
          <Route exact path={`${Constants.APP_URL_PATH}games`}>
            <Games />
          </Route>
          <Route exact path={`${Constants.APP_URL_PATH}games/:id`}>
            <Game />
          </Route>
          <Route path={`${Constants.APP_URL_PATH}games/:id/edit`}>
            <GameForm edit={true}/>
          </Route>
          <Route path={`${Constants.APP_URL_PATH}games/:id/scores`}>
            <Scores />
          </Route>
          <Route path={`${Constants.APP_URL_PATH}addGame`}>
            <GameForm />
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
          <Route path={`${Constants.APP_URL_PATH}scores`}>
            <ScoreTable />
          </Route>
          <Route path={`${Constants.APP_URL_PATH}players/:id`}>
            <Player />
          </Route>
          <Route path={`${Constants.APP_URL_PATH}invitations`}>
            <Invitations />
          </Route>
          <Route path={`${Constants.APP_URL_PATH}events`}>
            <Events />
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

const NavbarItem = (input) => (
    <li className="nav-item">
      <Link to={input.to} className="nav-link">{input.title}</Link>
    </li>
);

export default Main;
