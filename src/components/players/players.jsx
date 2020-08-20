import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import * as Constants from '../../constants';
import { loadPlayers } from '../../actions/teamsActions';
import PlayerList from './player_list.jsx';
import { restFetch2 } from '../../utils/communication';
import ErrorPage from '../error_page.jsx';

const Players = () => {
  const players = useSelector((state) => state.teams.players);
  const [searchValue, setSearchValue] = useState('');
  const [pageError, setPageError] = useState({});

  const dispatch = useDispatch();

  const cookies = useCookies();
  const removeCookie = cookies[2];

  useEffect(() => {
    restFetch2(`${Constants.SERVER_PATH}api/players`, dispatch, removeCookie).then((result) => {
      dispatch(loadPlayers(result));
    }).catch((error) => {
      setPageError(error);
    });
  }, [dispatch, removeCookie]);

  const handleSearchValueChanged = (event) => {
    setSearchValue(event.target.value);
  };

  if (!pageError.message) {
    return (
      <div className="d-flex justify-content-center mt-4">
        <div style={{ width: 500 }}>
          <h1 className="text-center display-4">Players</h1>
          <div className="form-group mx-2 mt-4">
            <input onChange={handleSearchValueChanged} className="form-control" type="text" placeholder="Search"
                   value={searchValue}/>
          </div>
          <PlayerList
            players={players} withBadge={false} searchValue={searchValue} withAge={true} />
        </div>
      </div>
    );
  }
  return <ErrorPage status={pageError.status} message={pageError.message} />;
};

export default Players;
