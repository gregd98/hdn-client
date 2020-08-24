import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { restFetch2 } from '../../utils/communication';
import * as Constants from '../../constants';
import { loadGame } from '../../actions/eventActions';

const Game = () => {
  const { id } = useParams();
  const gameData = useSelector((state) => state.event.gamesData);
  const dispatch = useDispatch();
  const cookies = useCookies();
  const removeCookie = cookies[2];

  useEffect(() => {
    restFetch2(`${Constants.SERVER_PATH}api/games/${id}`, dispatch, removeCookie).then((result) => {
      dispatch(loadGame(result));
    }).catch((error) => {
      console.log(error.message);
    });
  }, [dispatch, id, removeCookie]);

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
          <Card title="Contributors">
            <div className="d-flex flex-wrap">
              {game.assignments.map((contributor) => (
                  <div key={contributor.id} style={{ background: '#17a2b8', color: 'white', fontSize: 'small' }}
                       className="rounded px-2 py-1 mt-1 ml-1">
                    <b>{contributor.lastName} {contributor.firstName}</b>
                  </div>
              ))}
            </div>
          </Card>
          {game.permissions.includes('admin') && (
            <Card title="Administration">
              <button className="btn btn-outline-danger">Move ownership</button>
              <button className="btn btn-outline-danger ml-2">Delete game</button>
            </Card>
          )};
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
