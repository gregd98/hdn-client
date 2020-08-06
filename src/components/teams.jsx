import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import * as Constants from '../constants';
import {loadContacts, loadTeams} from '../actions/teamsActions';
import { logOut } from '../actions/userActions';

const Teams = () => {
  const teams = useSelector((state) => state.teams.teams);
  const contacts = useSelector((state) => state.teams.contacts);
  const dispatch = useDispatch();

  const cookies = useCookies();
  const removeCookie = cookies[2];

  useEffect(() => {
    fetch(`${Constants.SERVER_PATH}api/teams`, {
      method: 'GET',
      credentials: 'include',
    }).then((result) => result.json()).then((result) => {
      if (result.succeed) {
        dispatch(loadTeams(result.payload));
      } else if (!result.authenticated) {
        removeCookie('loggedin', { path: '/' });
        dispatch(logOut());
      } else {
        console.log(result.message);
      }
    }).catch((error) => {
      console.log(`Error: ${error.message}`);
    });
  }, [dispatch, removeCookie]);

  useEffect(() => {
    fetch(`${Constants.SERVER_PATH}api/leaderContacts`, {
      method: 'GET',
      credentials: 'include',
    }).then((result) => result.json()).then((result) => {
      if (result.succeed) {
        console.log(result);
        dispatch(loadContacts(result.payload));
      } else if (!result.authenticated) {
        removeCookie('loggedin', { path: '/' });
        dispatch(logOut());
      } else {
        console.log(result.message);
      }
    }).catch((error) => {
      console.log(`Error: ${error.message}`);
    });
  }, [dispatch, removeCookie]);

  return (
    <div className="d-flex justify-content-center">
      <div style={{ width: 500 }}>
        <h3 className="text-center">Teams</h3>
        <div className="d-flex justify-content-center mt-4">
          <a className="btn btn-outline-primary ml-2" href={`mailto:${contacts.email ? contacts.email.join(',') : ''}`}>Email to all leaders</a>
          <a className="btn btn-outline-primary ml-2" href={`sms:${contacts.email ? contacts.phone.join(',') : ''}`}>SMS to all leaders</a>
        </div>
        <div className="list-group mt-4 mx-2">
          {teams.map((team) => <button key={team.id} type="button" className="list-group-item list-group-item-action">{team.name}</button>)}
        </div>
      </div>
    </div>
  );
};

export default Teams;
