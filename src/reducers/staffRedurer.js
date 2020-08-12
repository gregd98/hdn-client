import produce from 'immer';
import { actionLoadPosts, actionLoadPersons, actionLogOut } from '../actions/actionTypes';

const defaultState = {
  posts: [],
  persons: [],
};

const staffReducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionLoadPosts:
      return produce(state, (draft) => {
        draft.posts = action.payload;
      });
    case actionLoadPersons:
      return produce(state, (draft) => {
        draft.persons = action.payload;
      });
    case actionLogOut:
      return produce(state, (draft) => {
        draft.persons = [];
      });
    default:
      return state;
  }
};

export default staffReducer;
