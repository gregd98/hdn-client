import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import GameCard from './game_card.jsx';
import { loadDays, loadGames } from '../../actions/eventActions';
import { restFetch2 } from '../../utils/communication';
import * as Constants from '../../constants';
import ErrorPage from '../error_page.jsx';
import useScrollPosition from '../../utils/scroll';

const classNames = require('classnames');

// eslint-disable-next-line max-lines-per-function
const GameList = () => {
  const days = useSelector((state) => state.event.days);
  const games = useSelector((state) => state.event.games);
  const [buttons, setButtons] = useState({});
  const [uiGames, setUiGames] = useState([]);

  const dispatch = useDispatch();
  const cookies = useCookies();
  const removeCookie = cookies[2];
  const [pageError, setPageError] = useState({});
  const [refs, setRefs] = useState([]);
  const [selectedDay, setSelectedDay] = useState(0);

  const navRef = React.createRef();

  useEffect(() => {
    restFetch2(`${Constants.SERVER_PATH}api/days`, dispatch, removeCookie).then((resultDays) => {
      dispatch(loadDays(resultDays.map((day) => new Date(day))));
    }).then(() => restFetch2(`${Constants.SERVER_PATH}api/games`, dispatch, removeCookie))
      .then((resultGames) => {
        dispatch(loadGames(resultGames));
      })
      .catch((error) => {
        setPageError(error);
      });
  }, [dispatch, removeCookie]);

  const handleScroll = () => {
    if (refs.length > 0) {
      let k = 0;
      refs.forEach((ref, i) => {
        if (i === 0 || ref.ref.current.getBoundingClientRect().bottom
          - navRef.current.getBoundingClientRect().bottom <= 0) {
          k = ref.num;
        }
      });
      setSelectedDay(k);
    }
  };

  useEffect(() => {
    const tmp = {};
    const daySet = new Set(games.map((game) => (new Date(game.startTime)).getDate()));
    let selected = false;
    days.forEach((day) => {
      const dayNum = day.getDate();
      tmp[dayNum] = { num: dayNum, name: day.toLocaleDateString('en-US', { weekday: 'long' }), active: false };
      tmp[dayNum].disabled = !daySet.has(dayNum);
      if (!tmp[dayNum].disabled) {
        tmp[dayNum].ref = React.createRef();
        if (!selected) {
          setSelectedDay(dayNum);
          selected = true;
        }
      }
    });

    const nana = [];
    const tmpRefs = [];
    let lastDay = -1;
    games.forEach((game, i) => {
      const currentDay = (new Date(game.startTime)).getDate();
      if (i === 0 || currentDay !== lastDay) {
        nana.push({ ...game, ref: tmp[currentDay].ref });
        if (i === 0) {
          tmpRefs.push({ num: currentDay });
        } else {
          const ref = React.createRef();
          nana[i - 1] = { ...nana[i - 1], ref };
          tmpRefs.push({ num: currentDay, ref });
        }
      } else {
        nana.push({ ...game });
      }
      lastDay = currentDay;
    });

    setButtons(tmp);
    setRefs(tmpRefs);
    setUiGames(nana);
  }, [days, games]);

  useScrollPosition(handleScroll);

  const handleDayClicked = (button) => {
    const navParams = navRef.current.getBoundingClientRect();
    const offset = button.ref.current.getBoundingClientRect().top
      - navParams.bottom + navParams.top;
    window.scrollBy({ top: offset, behavior: 'smooth' });
  };

  if (!pageError.message) {
    return (
      <React.Fragment>
        <nav ref={navRef} className="navbar navbar-light bg-white sticky-top mt-2 border shadow-sm">
          <a className="navbar-brand" href="#">Navbar</a>
          <ul className="nav nav-pills">
            {Object.values(buttons).map((button) => {
              const classes = classNames({
                btn: true,
                'btn-link': true,
                'nav-link': true,
                active: button.num === selectedDay,
              });
              return (
                <li key={button.num} className="nav-item">
                  <button onClick={() => handleDayClicked(button)}
                          className={classes} disabled={button.disabled}>
                    {button.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <div>
          {uiGames.map((game) => <GameCard reff={game.ref} click={() => console.log('Game clicked.')} key={game.id} game={game}/>)}
        </div>
      </React.Fragment>
    );
  }
  return <ErrorPage status={pageError.status} message={pageError.message} />;
};

export default GameList;
