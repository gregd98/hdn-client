import React from 'react';
import { useHistory } from 'react-router-dom';
import * as Constants from '../../constants';

const searchInString = (text, searched) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().search(searched.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()) >= 0;

const StaffList = (input) => {
  const { users, activePostId, searchValue } = input;
  const history = useHistory();
  if (users.length > 0) {
    return (
      <React.Fragment>
        <div className="list-group mt-4 mx-2">
          {users
            .filter((user) => user.postId === activePostId)
            .filter((user) => !searchValue || searchInString(`${user.lastName} ${user.firstName}`, searchValue))
            .map(
              (user) => (
                <div key={user.id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center" >
                  <span>
                    <button onClick={() => history.push(`${Constants.APP_URL_PATH}players/${user.id}`)} className="btn btn-link m-0 p-0">
                      {user.lastName} {user.firstName}
                    </button>
                  </span>
                  <span>
                    <button type="button" className="btn btn-sm btn-outline-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Contact
                      </button>
                      <div className="dropdown-menu">
                        <a className="dropdown-item" href={`tel:${user.phone}`}>Call</a>
                        <a className="dropdown-item" href={`sms:${user.phone}`}>SMS</a>
                        <div className="dropdown-divider" />
                        <a className="dropdown-item" href={`mailto:${user.email}`}>Email</a>
                      </div>
                    </span>
                </div>
              ),
            )}
        </div>
      </React.Fragment>
    );
  }
  return <p>Nothing to show.</p>;
};

export default StaffList;
