import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import { restFetch2 } from '../../utils/communication';
import * as Constants from '../../constants';
import { loadGame } from '../../actions/eventActions';
import { loadPersons } from '../../actions/staffActions';

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

  useEffect(() => {
    restFetch2(`${Constants.SERVER_PATH}api/games/${id}`, dispatch, removeCookie).then((result) => {
      dispatch(loadGame(result));
    }).then(() => restFetch2(`${Constants.SERVER_PATH}api/users`, dispatch, removeCookie)).then((persons) => {
      dispatch(loadPersons(persons));
    })
      .catch((error) => {
        console.log(error.message);
      });
  }, [dispatch, id, removeCookie]);

  useEffect(() => {
    const removeModal = () => {
      window.$('#staticBackdrop').modal('hide');
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
    fetch(`${Constants.SERVER_PATH}api/games/${id}/assignments`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(Array.from(contributors)),
    }).then((result) => result.json()).then((result) => {
      if (result.succeed) {
        window.$('#staticBackdrop').modal('hide');
        restFetch2(`${Constants.SERVER_PATH}api/games/${id}`, dispatch, removeCookie).then((res) => {
          dispatch(loadGame(res));
        }).catch((error) => {
          console.log(error.message);
        });
      } else {
        console.log('Nem sikerult az update tess.');
      }
    }).catch((error) => {
      console.log(`Network error: ${error.messageg}`);
    });
  };

  const moveOwner = (userId) => {
    fetch(`${Constants.SERVER_PATH}api/games/${id}/moveOwner`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(userId),
    }).then((result) => result.json()).then((result) => {
      if (result.succeed) {
        history.push(`${Constants.APP_URL_PATH}games`);
      }
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

  const renderUserList = (withCheckbox, click = toggleCheckbox) => {
    return (
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
  };

  const renderModal = () => {
    return (
      <div className="modal fade" id="staticBackdrop" data-backdrop="static" data-keyboard="false" tabIndex="-1"
           aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">{assignmentsModal ? 'Select contributors' : 'Move ownership to:'}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {assignmentsModal ? renderUserList(true) : renderUserList(false, (user) => {
                console.log(`${user.id} clicked`);
                // todo ide az uset
                setNewOwner(user);
                window.$('#staticBackdrop').modal('hide');
                window.$('#exampleModal').modal('show');
              })}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              {assignmentsModal && (
                <button onClick={() => {
                  updateContributors();
                }} type="button" className="btn btn-primary">Save changes</button>
              )};
            </div>
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
          <div className="card border-dark my-2 mx-2 pt-1 pb-2 px-2 sticky-top">
            <div>
              <div className="d-flex justify-content-center mt-2">
                <h2>{game.name}</h2>
              </div>
              <div className="d-flex justify-content-center mt-2">
                <button className="btn btn-primary">Add score</button>
                {game.permissions.includes('edit') && (
                  <button className="btn btn-outline-secondary ml-2">Edit game</button>
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
              <DetailItem label="Owner:" value={game.ownerId}/>
              {game.location && (
                <DetailItem label="Location:" value={game.location}/>
              )}
              <DetailItem label="Player count:" value={game.playerCount}/>
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
                  setAssignmentsModal(true);
                  const tmp = new Set();
                  game.assignments.forEach((user) => tmp.add(user.id));
                  setContributors(tmp);
                }} className="btn btn-link mt-2" data-toggle="modal" data-target="#staticBackdrop" >Edit contributors</button>
              )}
            </Card>
          )}
          {game.permissions.includes('admin') && (
            <Card title="Administration">
              <button onClick={() => setAssignmentsModal(false)} className="btn btn-outline-danger" data-toggle="modal" data-target="#staticBackdrop">Move ownership</button>
              <button className="btn btn-outline-danger ml-2">Delete game</button>
            </Card>
          )};
        </div>
        {renderModal()}

        <div className="modal fade" id="exampleModal" data-backdrop="static" data-keyboard="false" tabIndex="-1"
             aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Move ownership</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {'Do you want to move '}<b>{game.name}</b>{'\'s ownership to '}<b>{newOwner.lastName} {newOwner.firstName}?</b>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button onClick={() => {
                  moveOwner(newOwner.id);
                }} type="button" className="btn btn-primary">Move</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  };
  if (gameData[id]) {
    return renderGamePage();
  }
  return <h4>Loading</h4>;
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

export default Game;
