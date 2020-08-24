import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import GameList from './game_list.jsx';
import * as Constants from '../../constants';
import { setCurrentTab } from '../../actions/eventActions';

const classNames = require('classnames');

const Games = () => {
  const userPermissions = useSelector((state) => state.user.permissions);
  const history = useHistory();
  const dispatch = useDispatch();
  const [permAllGames, setPermAllGames] = useState(false);

  useEffect(() => {
    if (userPermissions.includes(Constants.PERM_ALL_GAME_ACCESS)) {
      setPermAllGames(true);
      dispatch(setCurrentTab('all'));
    } else {
      dispatch(setCurrentTab('own'));
    }
  }, [dispatch, userPermissions]);

  const addGameClicked = () => {
    history.push(`${Constants.APP_URL_PATH}addgame`);
  };

  const tabClicked = (e, type) => {
    window.$(`#${e.target.id}`).tab('show');
    dispatch(setCurrentTab(type));
  };

  return (
    <div className="d-flex justify-content-center mt-4">
      <div style={{ width: 500 }}>
        <h1 className="text-center display-4">Games</h1>
        {userPermissions.includes(Constants.PERM_ADD_GAME) && (
          <div className="d-flex justify-content-center mt-4">
            <button onClick={addGameClicked} type="button" className="btn btn-outline-primary">Add game</button>
          </div>
        )}
        <ul className="nav nav-tabs mt-4" id="myTab" role="tablist">
          {permAllGames && <TabHeader type="all" label="All games" active={true} click={tabClicked} /> }
          <TabHeader type="own" label="My games" active={!permAllGames} click={tabClicked} />
          {permAllGames && <TabHeader type="drafts" label="Drafts" active={false} click={tabClicked} /> }
        </ul>
        <div className="tab-content" id="myTabContent">
          <div className="tab-pane fade show active" id="tab-content">
            <GameList />
          </div>
        </div>
      </div>
    </div>
  );
};

const TabHeader = (input) => {
  const {
    type, label, active, click,
  } = input;

  const classes = classNames({
    'nav-link': true,
    btn: true,
    'btn-link': true,
    'shadow-none': true,
    active,
  });
  return (
    <li className="nav-item">
      <button onClick={(e) => click(e, type)} className={classes} id={`${type}-tab`} data-target="#tab-content">
        {label}
      </button>
    </li>
  );
};

export default Games;
