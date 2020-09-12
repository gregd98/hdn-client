import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import * as Constants from '../constants';
import { restFetch2 } from '../utils/communication';
import { loadTeams } from '../actions/teamsActions';
import { loadAllScores } from '../actions/eventActions';

const ScoreTable = () => {
  const teams = useSelector((state) => state.teams.teams);
  const scores = useSelector((state) => state.event.allScores);

  const dispatch = useDispatch();
  const cookies = useCookies();
  const removeCookie = cookies[2];

  useEffect(() => {
    restFetch2(`${Constants.SERVER_PATH}api/teams`, dispatch, removeCookie).then((result) => {
      dispatch(loadTeams(result));
    }).then(() => restFetch2(`${Constants.SERVER_PATH}api/scores`, dispatch, removeCookie)).then((result) => {
      dispatch(loadAllScores(result));
    })
      .catch((error) => {
        console.log(error.message);
      });
  }, [dispatch, removeCookie]);

  return (
    <React.Fragment>
      <div className="table-responsive">
    <table className="table table-sm table-dark table-striped sticky-header">
      <thead>
        <tr>
          <th scope="col">Games</th>
          {teams.map((team) => <th key={team.id} scope="col">{team.name}</th>)}
        </tr>
      </thead>
      <tbody>
      {scores.map((game) => (
          <tr key={game.id}>
            <th scope="row">{game.name}</th>
            {teams.map((team) => {
              if (game.scores[team.id]) {
                return <td key={team.id} className="text-center">{game.scores[team.id].score}</td>;
              }
              return <td key={team.id} className="text-center">-</td>;
            })}
          </tr>
      ))}
      </tbody>
    </table>
      </div>
    </React.Fragment>
  );
};

export default ScoreTable;
