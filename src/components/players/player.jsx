import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import { getInformation } from '../../utils/cnp';
import * as Constants from '../../constants';
import { restGet } from '../../utils/communication';
import ErrorPage from '../error_page.jsx';

const Player = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState({});
  const [pageError, setPageError] = useState({});

  const dispatch = useDispatch();
  const cookies = useCookies();
  const removeCookie = cookies[2];

  useEffect(() => {
    restGet(`${Constants.SERVER_PATH}api/players/${id}`, dispatch, removeCookie).then((result) => {
      setPlayer(result);
    }).catch((error) => {
      setPageError(error);
    });
  }, [dispatch, id, removeCookie]);

  if (!pageError.message) {
    if (player.id) {
      const cnp = getInformation(player.cnp);
      let teamExtension = '';
      if (player.rankId === 1) {
        teamExtension = ' (Vice leader)';
      }
      if (player.rankId === 2) {
        teamExtension = ' (Leader)';
      }
      return (
        <React.Fragment>
          <div className="d-flex justify-content-center mt-4">
            <div style={{ width: 500 }}>
              <h2 className="text-center" style={{ color: '#ffbc01' }}>{player.lastName} {player.firstName}</h2>
              <h5 className="text-center text-secondary">{player.team}{teamExtension}</h5>
              <div className="list-group mt-4 mx-2">
                <DetailItem label="Born date:" value={cnp.bornDate}/>
                <DetailItem label="Age:" value={cnp.age}/>
                <DetailItem label="Sex:" value={cnp.sex}/>
                <DetailItem label="Phone:" value={player.phone}/>
                {player.email && <DetailItem label="Email:" value={player.email}/>}
                <DetailItem label="CNP:" value={player.cnp}/>
              </div>

            </div>
          </div>
        </React.Fragment>
      );
    }
    return <h1>Loading</h1>;
  }
  return <ErrorPage status={pageError.status} message={pageError.message} />;
};

const DetailItem = (input) => (
    <div className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
      <p className="p-0 m-0">{input.label}</p>
      <p className="p-0 m-0">{input.value}</p>
    </div>
);

export default Player;
