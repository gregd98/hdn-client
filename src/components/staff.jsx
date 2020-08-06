import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import * as Constants from '../constants';
import { loadPosts, loadPersons } from '../actions/staffActions';
import { logOut } from '../actions/userActions';

const classNames = require('classnames');

const Staff = () => {
  const posts = useSelector((state) => state.staff.posts);
  const persons = useSelector((state) => state.staff.persons);
  const [activePostId, setActivePostId] = useState(0);
  const [selectedPerson, setSelectedPerson] = useState({});
  const [searchValue, setSearchValue] = useState('');
  const dispatch = useDispatch();

  const cookies = useCookies();
  const removeCookie = cookies[2];

  useEffect(() => {
    fetch(`${Constants.SERVER_PATH}api/posts`, {
      method: 'GET',
      credentials: 'include',
    }).then((result) => result.json()).then((result) => {
      if (result.succeed) {
        dispatch(loadPosts(result.payload));
        setActivePostId(result.payload[0].id);
      } else if (!result.authenticated) {
        removeCookie('loggedin', { path: '/' });
        dispatch(logOut());
      } else {
        console.log(result.message);
      }
    }).catch((error) => {
      console.log(`Error: ${error.message}`);
    });
  }, [dispatch, removeCookie]);

  useEffect(() => {
    fetch(`${Constants.SERVER_PATH}api/users`, {
      method: 'GET',
      credentials: 'include',
    }).then((result) => result.json()).then((result) => {
      if (result.succeed) {
        dispatch(loadPersons(result.payload));
      } else if (!result.authenticated) {
        removeCookie('loggedin', { path: '/' });
        dispatch(logOut());
      } else {
        console.log(result.message);
      }
    }).catch((error) => {
      console.log(`Error: ${error.message}`);
    });
  }, [dispatch, removeCookie]);

  const postClicked = (postId) => {
    setActivePostId(postId);
  };

  const personClicked = (person) => {
    setSelectedPerson(person);
  };

  const handleSearchValueChanged = (event) => {
    setSearchValue(event.target.value);
  };

  const searchInString = (text, searched) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().search(searched.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()) >= 0;

  return (
      <div className="d-flex justify-content-center">
        <div style={{ width: 500 }}>
          <h3 className="text-center">Staff</h3>
          <div className="form-group mx-2 mt-4">
            <input onChange={handleSearchValueChanged} className="form-control" type="text" placeholder="Search" value={searchValue}/>
          </div>
          <div className="list-group list-group-horizontal mx-2 mt-2" id="list-tab" role="tablist">
            {posts.map((post) => {
              const classes = classNames({
                btn: true,
                'shadow-none': true,
                'rounded-0': true,
                'list-group-item': true,
                active: activePostId === post.id,
                'flex-fill': true,
              });
              return (
                <button key={post.id} onClick={() => postClicked(post.id)} className={classes}>
                  {post.name}
                </button>
              );
            })}
            </div>
            <div className="list-group mt-2 mx-2">
              {persons.filter((person) => person.postId === activePostId && (!searchValue || searchInString(`${person.lastName} ${person.firstName}`, searchValue)))
                .map(
                  (person) => <button onClick={() => personClicked(person)} key={person.id} type="button" className="list-group-item list-group-item-action" data-toggle="modal" data-target="#exampleModal">{person.lastName} {person.firstName}</button>,
                )}
            </div>
        </div>
        <div className="modal fade" id="exampleModal"  role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4>{selectedPerson.lastName} {selectedPerson.firstName}</h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <a href={`tel:${selectedPerson.phone}`} className="btn btn-lg btn-outline-primary">Call</a>
                <a href={`sms:${selectedPerson.phone}`} className="btn btn-lg btn-outline-primary ml-2">SMS</a>
                <a href={`mailto:${selectedPerson.email}`} className="btn btn-lg btn-outline-primary ml-2">E-mail</a>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Staff;
