import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { restDelete, restGet, restPost } from '../../utils/communication';
import * as Constants from '../../constants';
import { loadGame } from '../../actions/eventActions';
import { loadPersons } from '../../actions/staffActions';
import { getTimeByDate, getWeekdayByDate } from '../../utils/mysql_date';
import ErrorPage from '../error_page.jsx';
import LoadingPage from '../loading_page.jsx';

const classNames = require('classnames');

const Game = () => {
  const { id } = useParams();
  const gameData = useSelector((state) => state.event.gamesData);
  const users = useSelector((state) => state.staff.persons);
  const dispatch = useDispatch();
  const cookies = useCookies();
  const history = useHistory();
  const removeCookie = cookies[2];
  const [contributors, setContributors] = useState(new Set());
  const [assignmentsModal, setAssignmentsModal] = useState(true);
  const [newOwner, setNewOwner] = useState({ id: 0, firstName: '', lastName: '' });
  const [dialogLoading, setDialogLoading] = useState(false);
  const [dialogError, setDialogError] = useState('');

  const [pageError, setPageError] = useState({});
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (!gameData[id]) {
      setLoading(true);
    }
    restGet(`${Constants.SERVER_PATH}api/games/${id}`, dispatch, removeCookie).then((result) => {
      dispatch(loadGame(result));
    }).then(() => restGet(`${Constants.SERVER_PATH}api/users`, dispatch, removeCookie)).then((persons) => {
      dispatch(loadPersons(persons));
      setLoading(false);
    })
      .catch((error) => {
        setPageError(error);
        setLoading(false);
      });
  }, [dispatch, gameData, id, removeCookie]);

  useEffect(() => {
    const removeModal = () => {
      window.$('#listModal').modal('hide');
      window.$('#moveOwnerDialog').modal('hide');
      window.$('#deleteGameDialog').modal('hide');
      window.$('body').removeClass('modal-open');
      window.$('.modal-backdrop').remove();
    };
    window.onpopstate = removeModal;
    return () => {
      removeModal();
      window.onpopstate = () => {};
    };
  }, []);

  const updateContributors = () => {
    setDialogLoading(true);
    restPost(`${Constants.SERVER_PATH}api/games/${id}/assignments`, Array.from(contributors), dispatch, removeCookie).then(() => {
      setDialogLoading(false);
      window.$('#listModal').modal('hide');
      restGet(`${Constants.SERVER_PATH}api/games/${id}`, dispatch, removeCookie).then((res) => {
        dispatch(loadGame(res));
      }).catch((error) => {
        setPageError(error);
      });
    }).catch((error) => {
      setDialogLoading(false);
      setDialogError(error.message);
    });
  };

  const moveOwner = (userId) => {
    setDialogLoading(true);
    restPost(`${Constants.SERVER_PATH}api/games/${id}/moveOwner`, userId, dispatch, removeCookie).then(() => {
      setDialogLoading(false);
      history.push(`${Constants.APP_URL_PATH}games`);
    }).catch((error) => {
      setDialogLoading(false);
      setDialogError(error.message);
    });
  };

  const deleteGame = () => {
    setDialogLoading(true);
    restDelete(`${Constants.SERVER_PATH}api/games/${id}`, dispatch, removeCookie).then(() => {
      setDialogLoading(false);
      history.push(`${Constants.APP_URL_PATH}games`);
    }).catch((error) => {
      setDialogLoading(false);
      setDialogError(error.message);
    });
  };

  const toggleCheckbox = (user) => {
    const tmp = new Set(contributors);
    if (tmp.has(user.id)) {
      tmp.delete(user.id);
    } else {
      tmp.add(user.id);
    }
    setContributors(tmp);
  };

  const renderUserList = (withCheckbox, click = toggleCheckbox) => (
      <div className="list-group">
        {users
          .filter((user) => user.id !== gameData[id].ownerId)
          .map(
            (user) => (
              <div onClick={() => click(user)} key={user.id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center clickable" >
                <p className="m-0 p-0">{user.lastName} {user.firstName}</p>
                {withCheckbox && (
                  <input onChange={() => toggleCheckbox(user)} className="form-check-input-lg" type="checkbox" id={`ch-${user.id}`} checked={contributors.has(user.id)}/>
                )}
              </div>
            ),
          )}
      </div>
  );

  const renderModal = (input) => {
    const { errorMessage, isDialogLoading } = input;
    return (
      <div className="modal fade" id="listModal" data-backdrop="static" data-keyboard="false" tabIndex="-1">
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{assignmentsModal ? 'Select contributors' : 'Move ownership to:'}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" disabled={isDialogLoading}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {assignmentsModal ? renderUserList(true) : renderUserList(false, (user) => {
                setDialogError('');
                setNewOwner(user);
                window.$('#listModal').modal('hide');
                window.$('#moveOwnerDialog').modal('show');
              })}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal" disabled={isDialogLoading}>Close</button>
              {assignmentsModal && (
                <button onClick={() => {
                  updateContributors();
                }} type="button" className="btn btn-primary" disabled={isDialogLoading}>
                  {isDialogLoading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />}
                  Save changes
                </button>
              )};
            </div>
            {errorMessage && <div className="alert alert-danger mx-2" role="alert">{errorMessage}</div>}
          </div>
        </div>
      </div>
    );
  };

  const renderGamePage = () => {
    const game = gameData[id];
    return (
      <div className="d-flex justify-content-center mt-2">
        <div style={{ width: 500 }}>
          <div className="card text-center border-dark my-2 mx-2  px-2 sticky-top">
            <div className="card-body">
              <h2 className="card-title">{game.name}</h2>
              <div className="d-flex justify-content-center mt-2">
                <button onClick={() => {
                  history.push(`${Constants.APP_URL_PATH}games/${id}/scores`);
                }} className="btn btn-primary">Add score</button>
                {game.permissions.includes('edit') && (
                  <button onClick={() => {
                    history.push(`${Constants.APP_URL_PATH}games/${id}/edit`);
                  }} className="btn btn-outline-secondary ml-2">Edit game</button>
                )}
              </div>
            </div>
          </div>
          {game.description && (
            <Card title="Description">
              <p>{game.description}</p>
            </Card>
          )}
          {game.notes && (
            <Card title="Notes">
              <p>{game.notes}</p>
            </Card>
          )}
          <Card title="Details">
            <div className="list-group mt-4 mx-2">
              <DetailItem label="Owner:" value={`${game.lastName} ${game.firstName}`}/>
              {game.location && (
                <DetailItem label="Location:" value={game.location}/>
              )}
              <DetailItem label="Player count:" value={game.playerCount}/>
              {game.startTime && (
                <React.Fragment>
                  <DetailItem label="Day:" value={getWeekdayByDate(game.startTime)} />
                  <DetailItem label="Time:" value={`${getTimeByDate(game.startTime)} - ${getTimeByDate(game.endTime)}`} />
                </React.Fragment>
              )}
            </div>
          </Card>
          {(game.assignments.length > 0 || game.permissions.includes('admin')) && (
            <Card title="Contributors">
              <div className="d-flex flex-wrap">
                {game.assignments.map((contributor) => (
                  <div key={contributor.id} style={{ background: '#17a2b8', color: 'white', fontSize: 'small' }}
                       className="rounded px-2 py-1 mt-1 ml-1">
                    <b>{contributor.lastName} {contributor.firstName}</b>
                  </div>
                ))}
              </div>
              {game.permissions.includes('admin') && (
                <button onClick={() => {
                  setDialogError('');
                  setAssignmentsModal(true);
                  const tmp = new Set();
                  game.assignments.forEach((user) => tmp.add(user.id));
                  setContributors(tmp);
                }} className="btn btn-link mt-2" data-toggle="modal" data-target="#listModal" >Edit contributors</button>
              )}
            </Card>
          )}
          {game.permissions.includes('admin') && (
            <Card title="Administration">
              <button onClick={() => setAssignmentsModal(false)} className="btn btn-outline-danger" data-toggle="modal" data-target="#listModal">Move ownership</button>
              <button onClick={() => {
                setDialogError('');
                window.$('#deleteGameDialog').modal('show');
              }} className="btn btn-outline-danger ml-2">Delete game</button>
            </Card>
          )}
        </div>
        {renderModal({ errorMessage: dialogError, isDialogLoading: dialogLoading })}

        <ConfirmationDialog errorMessage={dialogError} isDialogLoading={dialogLoading} id="moveOwnerDialog" title="Move ownership" text={
          (
            <React.Fragment>
              {'Do you want to move '}<b>{game.name}</b>{'\'s ownership to '}<b>{newOwner.lastName} {newOwner.firstName}?</b>
            </React.Fragment>
          )
        } confirmBtnText="Move" btnHandler={() => {
          moveOwner(newOwner.id);
        }} />

        <ConfirmationDialog errorMessage={dialogError} isDialogLoading={dialogLoading} id="deleteGameDialog" title="Delete game" text={
          (
            <React.Fragment>
              {'Do you want to delete '}<b>{game.name}</b>?
            </React.Fragment>
          )
        } confirmBtnText="Delete" btnType="danger" btnHandler={() => {
          console.log(`Delete game ${game.name}`);
          deleteGame();
        }} />

      </div>
    );
  };

  if (pageError.message) {
    return <ErrorPage status={pageError.status} message={pageError.message} />;
  }

  if (isLoading) {
    return <LoadingPage />;
  }
  if (gameData[id]) {
    return renderGamePage();
  }
  return <LoadingPage />;
};

const Card = (prop) => (
  <div className="card border-gray my-2 mx-2">
    <div className="card-body">
      <h4>{prop.title}</h4>
      {prop.children}
    </div>
  </div>
);

const DetailItem = (input) => (
  <div className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
    <p className="p-0 m-0">{input.label}</p>
    <p className="p-0 m-0">{input.value}</p>
  </div>
);

const ConfirmationDialog = (input) => {
  const {
    id, title, text, confirmBtnText, btnHandler, errorMessage, isDialogLoading,
  } = input;
  let { btnType } = input;
  if (!btnType) {
    btnType = 'primary';
  }
  const classes = classNames({
    btn: true,
    [`btn-${btnType}`]: true,
  });

  return (
    <div className="modal fade" id={id} data-backdrop="static" data-keyboard="false" tabIndex="-1">
      <div className="modal-dialog modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">{text}</div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
            <button onClick={() => btnHandler()} type="button" className={classes} disabled={isDialogLoading}>
              {isDialogLoading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />}
              {confirmBtnText}
            </button>
          </div>
          {errorMessage && <div className="alert alert-danger mx-2" role="alert">{errorMessage}</div>}
        </div>
      </div>
    </div>
  );
};

export default Game;
