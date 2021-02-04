import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import {
  restDelete, restGet, restPost, restPut,
} from '../../utils/communication';
import * as Constants from '../../constants';
import { loadTeams } from '../../actions/teamsActions';
import { loadGame, loadScores } from '../../actions/eventActions';
import ErrorPage from '../error_page.jsx';
import LoadingPage from '../loading_page.jsx';

const classNames = require('classnames');

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

  const [pageError, setPageError] = useState({});
  const [isLoading, setLoading] = useState(false);

  const [dialogLoading, setDialogLoading] = useState(false);
  const [dialogError, setDialogError] = useState('');
  const [inputError, setInputError] = useState('');

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
        if (a.fairplay) {
          return b.fairplay ? 0 : -1;
        }
        return b.fairplay ? 1 : 0;
      }
      return 1;
    }
    return x2 ? -1 : 0;
  };

  useEffect(() => {
    setLoading(true);
    restGet(`${Constants.SERVER_PATH}api/games/${id}`, dispatch, removeCookie).then((result) => {
      dispatch(loadGame(result));
    }).then(() => restGet(`${Constants.SERVER_PATH}api/teams`, dispatch, removeCookie).then((result) => {
      dispatch(loadTeams(result));
    }).then(() => restGet(`${Constants.SERVER_PATH}api/games/${id}/scores`, dispatch, removeCookie).then((mScores) => {
      dispatch(loadScores(id, mScores));
      setLoading(false);
    }))).catch((error) => {
      setPageError(error);
      setLoading(false);
    });
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
    const checkInt = (str) => {
      const s = String(str);
      const n = Math.floor(Number(s));
      return n !== Infinity && String(n) === s && n >= 0;
    };

    if (checkInt(currentScore)) {
      setDialogLoading(true);
      const body = {
        teamId: currentTeamId,
        score: Number(currentScore),
        fairplay: currentFairplay,
      };
      (editing ? restPost : restPut)(`${Constants.SERVER_PATH}api/games/${id}/scores`, body, dispatch, removeCookie).then(() => {
        window.$('#scoreModal').modal('hide');
        setDialogLoading(false);
        restGet(`${Constants.SERVER_PATH}api/games/${id}/scores`, dispatch, removeCookie).then((mScores) => {
          dispatch(loadScores(id, mScores));
        }).catch((error) => {
          setPageError(error);
        });
      }).catch((error) => {
        setDialogError(error.message);
        setDialogLoading(false);
      });
    } else {
      setInputError('Enter a number greater than or equal to 0.');
    }
  };

  const deleteScore = () => {
    setDialogLoading(true);
    restDelete(`${Constants.SERVER_PATH}api/games/${id}/scores/${currentTeamId}`, dispatch, removeCookie).then(() => {
      window.$('#scoreModal').modal('hide');
      setDialogLoading(false);
      restGet(`${Constants.SERVER_PATH}api/games/${id}/scores`, dispatch, removeCookie).then((mScores) => {
        dispatch(loadScores(id, mScores));
      }).catch((error) => {
        setPageError(error);
      });
    }).catch((error) => {
      setDialogError(error.message);
      setDialogLoading(false);
    });
  };

  const renderScoreModal = () => {
    const renderScoreInput = () => {
      const classes = classNames({
        'form-control': true,
        'is-invalid': inputError,
      });

      return (
        <React.Fragment>
          <input autoComplete="off" onChange={(e) => {
            setInputError('');
            setCurrentScore(e.target.value);
          }} type="number" min="0" className={classes} id="input_score" placeholder="Score" value={currentScore} disabled={dialogLoading}/>
          {inputError && <div className="invalid-feedback">{inputError}</div>}
        </React.Fragment>
      );
    };

    return (
      <div className="modal fade" id="scoreModal" data-backdrop="static" data-keyboard="false" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Score</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" disabled={dialogLoading}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group col-md-6">
                  {renderScoreInput()}
                </div>
                <div className="form-group col-md-6 align-self-center">
                  <div className="form-check">
                    <input onChange={(e) => {
                      setCurrentFairplay(e.target.checked);
                    }} autoComplete="off" type="checkbox" className="form-check-input" id="input_fairplay"
                           checked={currentFairplay} disabled={dialogLoading}/>
                    <label className="form-check-label" htmlFor="input_fairplay">Fair play</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal" disabled={dialogLoading}>Close
              </button>
              {editing && (
                <button onClick={deleteScore} type="button" className="btn btn-danger" disabled={dialogLoading}>
                  {dialogLoading
                  && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"/>}
                  Delete score
                </button>
              )}
              <button onClick={updateScore} type="button" className="btn btn-primary" disabled={dialogLoading}>
                {dialogLoading
                && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"/>}
                {editing ? 'Edit score' : 'Save score'}
              </button>
            </div>
            {dialogError && <div className="alert alert-danger mx-2" role="alert">{dialogError}</div>}
          </div>
        </div>
      </div>
    );
  };

  if (pageError.message) {
    return <ErrorPage status={pageError.status} message={pageError.message} />;
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="d-flex justify-content-center mt-4">
      <div style={{ width: 500 }}>
        {game && <h2 className="text-center">{game.name}</h2>}
        <h5 className="text-center">{scoreCounter}</h5>
        <div className="list-group mt-4 mx-2">
          {uiScores.length > 0 && uiScores.map((scoreItem) => (
            <div key={scoreItem.id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center clickable"
            onClick={() => {
              setDialogLoading(false);
              setDialogError('');
              setCurrentTeamId(scoreItem.id);
              if (scoreItem.score || scoreItem.score === 0) {
                setEditing(true);
                setCurrentScore(scoreItem.score);
                setCurrentFairplay(Boolean(scoreItem.fairplay));
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
