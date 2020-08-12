import React from 'react';
import GameCard from './game_card.jsx';

const GameList = (input) => {
  const { days, games } = input;
  return (
    <React.Fragment>
      <nav id="navbar-example2" className="navbar navbar-light bg-white sticky-top mt-2 border shadow-sm">
        <a className="navbar-brand" href="#">Navbar</a>
        <ul className="nav nav-pills">
          {days.map((day) => (
            <li key={day} className="nav-item">
              <button className="btn btn-link nav-link active">{day.toLocaleDateString('en-US', { weekday: 'long' })}</button>
            </li>
          ))}
        </ul>
      </nav>
      <div data-spy="scroll" data-target="#navbar-example2" data-offset="0">
        {games.map((game) => <GameCard click={() => console.log('Game clicked.')} key={game.id} game={game} />)}
      </div>
    </React.Fragment>
  );
};

export default GameList;
