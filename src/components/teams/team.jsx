import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import * as Constants from '../../constants';
import { loadTeam } from '../../actions/teamsActions';
import PlayerList from '../players/player_list.jsx';
import { restFetch } from '../../utils/communication';
import ErrorPage from '../error_page.jsx';
import LoadingPage from '../loading_page.jsx';

const Team = () => {
  const { id } = useParams();
  const teamsData = useSelector((state) => state.teams.teamsData);
  const dispatch = useDispatch();
  const [pageError, setPageError] = useState({});
  const [isLoading, setLoading] = useState(false);

  const cookies = useCookies();
  const removeCookie = cookies[2];

  useEffect(() => {
    if (!teamsData[id]) {
      setLoading(true);
    }
    restFetch(`${Constants.SERVER_PATH}api/teams/${id}`, (payload) => {
      dispatch(loadTeam(payload));
    }, setPageError, dispatch, removeCookie).then(() => {
      setLoading(false);
    });
  }, [dispatch, id, removeCookie]);

  const renderTeamPage = () => {
    const teamData = teamsData[id];
    const { players } = teamData;
    return (
      <div className="d-flex justify-content-center mt-4">
        <div style={{ width: 500 }}>
          <h2 className="text-center" style={{ color: '#ffbc01' }}>{teamData.team.name}</h2>
          <h6 className="text-center text-secondary">{teamData.team.city}</h6>
          <div className="d-flex justify-content-center mt-4">
            <a className="btn btn-outline-primary ml-2" href={`mailto:${players ? players
              .filter((player) => player.rankId > 0)
              .map((player) => player.email).join(',') : ''}`}>Email to leaders</a>
            <a className="btn btn-outline-primary ml-2" href={`sms:${players ? players
              .filter((player) => player.rankId > 0)
              .map((player) => player.phone).join(',') : ''}`}>SMS to leaders</a>
          </div>
          <PlayerList players={players} withBadge={true} withAge={true}/>
        </div>
      </div>
    );
  };
  if (pageError.message) {
    return <ErrorPage status={pageError.status} message={pageError.message} />;
  }
  if (isLoading || !teamsData[id]) {
    return <LoadingPage />;
  }
  return renderTeamPage();
};

export default Team;
