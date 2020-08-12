import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { useHistory, useRouteMatch } from 'react-router-dom';
import * as Constants from '../../constants';
import { loadContacts, loadTeams } from '../../actions/teamsActions';
import restFetch from '../../utils/communication';
import ErrorPage from '../error_page.jsx';
import LoadingPage from '../loading_page.jsx';

const Teams = () => {
  const teams = useSelector((state) => state.teams.teams);
  const contacts = useSelector((state) => state.teams.contacts);
  const dispatch = useDispatch();

  const [pageError, setPageError] = useState({});
  const [isLoading, setLoading] = useState(false);

  const cookies = useCookies();
  const removeCookie = cookies[2];

  const history = useHistory();
  const { path } = useRouteMatch();

  useEffect(() => {
    if (teams.length === 0) {
      console.log('Loading on');
      setLoading(true);
    }
    restFetch(`${Constants.SERVER_PATH}api/teams`, (payload) => {
      console.log('futaszar');
      dispatch(loadTeams(payload));
    }, setPageError, dispatch, removeCookie).then(() => restFetch(`${Constants.SERVER_PATH}api/leaderContacts`, (payload) => {
      dispatch(loadContacts(payload));
    }, setPageError, dispatch, removeCookie).then(() => {
      setLoading(false);
    }));
  }, [dispatch, removeCookie, teams.length]);

  if (pageError.message) {
    return <ErrorPage status={pageError.status} message={pageError.message} />;
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="d-flex justify-content-center mt-4">
      <div style={{ width: 500 }}>
        <h1 className="text-center display-4 ">Teams</h1>
        <div className="d-flex justify-content-center mt-4">
          <a className="btn btn-outline-primary ml-2"
             href={`mailto:${contacts.email ? contacts.email.join(',') : ''}`}>Email to all leaders</a>
          <a className="btn btn-outline-primary ml-2"
             href={`sms:${contacts.email ? contacts.phone.join(',') : ''}`}>SMS
            to all leaders</a>
        </div>
        <div className="list-group mt-4 mx-2">
          {teams.map((team) => (
            <div key={team.id} className="list-group-item list-group-item-action">
              <button onClick={() => history.push(`${path}/${team.id}`)} type="button"
                      className="btn btn-link m-0 p-0">
                {team.name}
              </button>
            </div>))
          }
        </div>
      </div>
    </div>
  );
};

export default Teams;
