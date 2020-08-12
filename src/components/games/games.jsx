import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import restFetch from '../../utils/communication';
import * as Constants from '../../constants';
import { loadDays, loadGames } from '../../actions/eventActions';
import GameList from './game_list.jsx';

const Games = () => {

  const [pageError, setPageError] = useState({});

  const days = useSelector((state) => state.event.days);
  const games = useSelector((state) => state.event.games);

  const inputRef = useRef();
  const navRef = useRef();

  const dispatch = useDispatch();
  const cookies = useCookies();
  const removeCookie = cookies[2];

  useEffect(() => {
    restFetch(`${Constants.SERVER_PATH}api/days`, (payload) => {
      dispatch(loadDays(payload.map((day) => new Date(day))));
    }, setPageError, dispatch, removeCookie);
  }, [dispatch, removeCookie]);

  useEffect(() => {
    restFetch(`${Constants.SERVER_PATH}api/games`, (payload) => {
      dispatch(loadGames(payload));
      // setGames(payload);
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
            <GameList days={days} games={games} />
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
