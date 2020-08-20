import React, { useState, useEffect } from 'react';

const GameCard = (input) => {
  const { game, reff } = input;
  const [time, setTime] = useState('');

  useEffect(() => {
    if (game.startTime) {
      const start = game.startTime.split(/[- :]/);
      const end = game.endTime.split(/[- :]/);
      setTime(`${start[3]}:${start[4]} - ${end[3]}:${end[4]}`);
    } else {
      setTime('No time set.');
    }
  }, [game.startTime, game.endTime]);

  return (
    <div ref={reff} className="card shadow-sm mt-2">
      <div className="card-header bg-transparent py-1">{time}</div>
        <div className="card-body pb-0">
          <h5 className="card-title">{game.name}</h5>
          <p className="card-text">{game.description}</p>
          <p className="card-text">
            <small className="text-muted">
              <b>
                {game.owner.lastName} {game.owner.firstName}
              </b>
              {game.assignments.length > 0 ? ` (${game.assignments.map((person) => `${person.lastName} ${person.firstName}`).join(', ')})` : ''}
            </small>
          </p>
          <a className="card-block stretched-link text-decoration-none" href={`/${game.id}`} />
        </div>
    </div>
  );
};

// TODO az a nem ugy mukodik mint a link/history FONTOSSS

export default GameCard;
