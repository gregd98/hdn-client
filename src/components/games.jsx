import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import restFetch from '../utils/communication';
import * as Constants from '../constants';
import { loadPlayers } from '../actions/teamsActions';
import GameCard from './game_card.jsx';

const Games = () => {
  const inputRef = useRef();
  const navRef = useRef();

  const [games, setGames] = useState([]);
  const [pageError, setPageError] = useState({});

  const dispatch = useDispatch();
  const cookies = useCookies();
  const removeCookie = cookies[2];

  useEffect(() => {
    restFetch(`${Constants.SERVER_PATH}api/games`, (payload) => {
      setGames(payload);
    }, setPageError, dispatch, removeCookie);
  }, [dispatch, removeCookie]);

  const handleScroll = () => {
    // console.log(`${inputRef.current.getBoundingClientRect().bottom} - ${navRef.current.getBoundingClientRect().bottom}`);
  };

  const ress = () => {
    console.log('Resize');
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', ress);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', ress);
    };
  });

  const kecske = (id) => {
    console.log(id);
  };

  return (
    <div className="d-flex justify-content-center mt-4">
      <div style={{ width: 500 }}>
        <h1 className="text-center display-4">Games</h1>
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
            <nav id="navbar-example2" className="navbar navbar-light bg-light sticky-top">
              <a className="navbar-brand" href="#">Navbar</a>
              <ul className="nav nav-pills">
                <li className="nav-item">
                  <button className="btn btn-link nav-link active">egy</button>
                </li>
                <li className="nav-item">
                  <a className="nav-link">ketto</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link">harom</a>
                </li>
              </ul>
            </nav>
            <div data-spy="scroll" data-target="#navbar-example2" data-offset="0">
              {games.map((game) => <GameCard click={kecske} key={game.id} game={game} />)}
            </div>
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
