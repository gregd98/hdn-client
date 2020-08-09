import React from 'react';
import { useHistory } from 'react-router-dom';
import { getInformation } from '../utils/cnp';
import * as Constants from '../constants';

const searchInString = (text, searched) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().search(searched.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()) >= 0;

const PlayerList = (input) => {
  const history = useHistory();
  if (input.players.length > 0) {
    return (
      <React.Fragment>
        <div className="list-group mt-4 mx-2">
          {input.players
            .filter((player) => !input.searchValue || searchInString(`${player.lastName} ${player.firstName}`, input.searchValue))
            .map(
              (player) => {
                const cnp = getInformation(player.cnp);
                return (
                  <div key={player.id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center" >
                    <span>
                      <button onClick={() => history.push(`${Constants.APP_URL_PATH}players/${player.id}`)} className="btn btn-link m-0 p-0">
                        {player.lastName} {player.firstName}
                      </button>
                      {(input.withBadge && player.rankId > 0) && <span className="badge badge-info ml-2">{player.rankId === 2 ? 'Leader' : 'Vice leader' }</span>}
                    </span>
                    <span>
                        <span className={`badge badge-pill badge-${cnp.age >= 18 ? 'success' : 'warning'} mr-2`}>{cnp.age}</span>
                        <button type="button" className="btn btn-sm btn-outline-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Contact
                        </button>
                        <div className="dropdown-menu">
                          <a className="dropdown-item" href={`tel:${player.phone}`}>Call</a>
                          <a className="dropdown-item" href={`sms:${player.phone}`}>SMS</a>
                          {player.email && (
                            <React.Fragment>
                              <div className="dropdown-divider" />
                              <a className="dropdown-item" href={`mailto:${player.email}`}>Email</a>
                            </React.Fragment>
                          )}
                        </div>
                      </span>
                  </div>
                );
              },
            )}
        </div>
      </React.Fragment>
    );
  }
  return <p>Nothing to show.</p>;
};

export default PlayerList;
