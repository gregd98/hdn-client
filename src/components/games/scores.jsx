import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { restFetch2 } from '../../utils/communication';
import * as Constants from '../../constants';
import { loadTeams } from '../../actions/teamsActions';
import { loadGame, loadScores } from '../../actions/eventActions';

const Scores = () => {
  const { id } = useParams();
  const game = useSelector((state) => state.event.gamesData[id]);
  const teams = useSelector((state) => state.teams.teams);
  const scores = useSelector((state) => state.event.scores);
  const [uiScores, setUiScores] = useState([]);
  const [scoreCounter, setScoreCounter] = useState('');
  const dispatch = useDispatch();
  const cookies = useCookies();
  const removeCookie = cookies[2];

  const [currentTeamId, setCurrentTeamId] = useState(null);
  const [currentScore, setCurrentScore] = useState('');
  const [currentFairplay, setCurrentFairplay] = useState(false);
  const [editing, setEditing] = useState(false);

  const scoreSorter = (a, b) => {
    const x1 = a.score || a.score === 0,
      x2 = b.score || b.score === 0;
    if (x1) {
      if (x2) {
        if (a.score > b.score) {
          return -1;
        }
        if (a.score < b.score) {
          return 1;
        }
        return 0;
      }
      return 1;
    }

    return x2 ? -1 : 0;
  };

  useEffect(() => {
    restFetch2(`${Constants.SERVER_PATH}api/games/${id}`, dispatch, removeCookie).then((result) => {
      dispatch(loadGame(result));
    }).then(() => restFetch2(`${Constants.SERVER_PATH}api/teams`, dispatch, removeCookie).then((result) => {
      dispatch(loadTeams(result));
    }).then(() => restFetch2(`${Constants.SERVER_PATH}api/games/${id}/scores`, dispatch, removeCookie).then((mScores) => {
      dispatch(loadScores(id, mScores));
    })));
  }, [dispatch, id, removeCookie]);

  useEffect(() => {
    const scoreList = scores[id],
      output = [];
    if (teams.length > 0 && scoreList) {
      const obj = {};
      scoreList.forEach((item) => {
        obj[item.teamId] = { score: item.score, fairplay: item.fairplay };
      });

      teams.forEach((item) => {
        const scoreData = obj[item.id];
        console.log('Csecs');
        console.log(scoreData);
        if (scoreData) {
          output.push({ ...item, score: scoreData.score, fairplay: scoreData.fairplay });
        } else {
          output.push({ ...item });
        }
      });
      setScoreCounter(`${scoreList.length}/${teams.length} scored`);
      setUiScores(output.sort(scoreSorter));
    }
  }, [id, scores, teams]);

  useEffect(() => {
    const removeModal = () => {
      window.$('#scoreModal').modal('hide');
      window.$('body').removeClass('modal-open');
      window.$('.modal-backdrop').remove();
    };
    window.onpopstate = removeModal;
    return () => {
      removeModal();
      window.onpopstate = () => {};
    };
  }, []);

  const updateScore = () => {
    fetch(`${Constants.SERVER_PATH}api/games/${id}/scores`, {
      method: editing ? 'POST' : 'PUT',
      credentials: 'include',
      body: JSON.stringify({
        teamId: currentTeamId,
        score: Number(currentScore),
        fairplay: currentFairplay,
      }),
    }).then((result) => result.json()).then((result) => {
      if (result.succeed) {
        window.$('#scoreModal').modal('hide');
        restFetch2(`${Constants.SERVER_PATH}api/games/${id}/scores`, dispatch, removeCookie).then((mScores) => {
          dispatch(loadScores(id, mScores));
        }).catch((error) => {
          console.log(error.message);
        });
      } else {
        console.log(result.message);
      }
    });
  };

  const renderScoreModal = () => (
      <div className="modal fade" id="scoreModal" data-backdrop="static" data-keyboard="false" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Score</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="input_score" className="col-form-label">Score:</label>
                <input autoComplete="off" onChange={(e) => {
                  setCurrentScore(e.target.value);
                }} type="text" className="form-control" id="input_score" value={currentScore} />
              </div>
              <div className="form-group form-check">
                <input onChange={(e) => {
                  setCurrentFairplay(e.target.checked);
                }} autoComplete="off" type="checkbox" className="form-check-input" id="input_fairplay" checked={currentFairplay}/>
                <label className="form-check-label" htmlFor="input_fairplay">Fair play</label>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button onClick={updateScore} type="button" className="btn btn-primary" disabled={false}>
                {false && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />}
                Save score
              </button>
            </div>
          </div>
        </div>
      </div>
  );

  return (
    <div className="d-flex justify-content-center mt-4">
      <div style={{ width: 500 }}>
        {game && <h2 className="text-center">{game.name}</h2>}
        <h5 className="text-center">{scoreCounter}</h5>
        <div className="list-group mt-4 mx-2">
          {uiScores.length > 0 && uiScores.map((scoreItem) => (
            <div key={scoreItem.id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center clickable"
            onClick={() => {
              setCurrentTeamId(scoreItem.id);
              if (scoreItem.score || scoreItem.score === 0) {
                setEditing(true);
                setCurrentScore(scoreItem.score);
                setCurrentFairplay(scoreItem.fairplay);
              } else {
                setEditing(false);
                setCurrentScore('');
                setCurrentFairplay(false);
              }
              window.$('#scoreModal').modal('show');
            }}>
              <span>
                <p className="m-0 p-0">
                  {scoreItem.name}
                </p>
              </span>
              <span>
                {scoreItem.fairplay === 1 && <span className="badge badge-pill badge-success mr-2">fair</span>}
                {(scoreItem.score || scoreItem.score === 0)
                  && <span><b>{scoreItem.score}</b></span>
                }
              </span>
            </div>
          ))}
        </div>
      </div>
      {renderScoreModal()}
    </div>
  );
};

export default Scores;
