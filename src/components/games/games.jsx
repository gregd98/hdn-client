import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import GameList from './game_list.jsx';
import * as Constants from '../../constants';

const Games = () => {
  const userPermissions = useSelector((state) => state.user.permissions);
  const history = useHistory();

  const addGameClicked = () => {
    history.push(`${Constants.APP_URL_PATH}addgame`);
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
        <ul className="nav nav-tabs mt-4 sticky-top" id="myTab" role="tablist">
          <li className="nav-item">
            <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home"
               aria-selected="true">Home</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile"
               aria-selected="false">Profile</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact"
               aria-selected="false">Contact</a>
          </li>
        </ul>
        <div className="tab-content" id="myTabContent">
          <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
            <GameList />
          </div>
          <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
            Ketto
          </div>
          <div className="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
            Harom
          </div>
        </div>

      </div>
    </div>
  );
};

export default Games;
