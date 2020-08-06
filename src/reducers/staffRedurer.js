import produce from 'immer';

const defaultState = {
  posts: [],
  persons: [],
};

const staffReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'LOAD_POSTS':
      return produce(state, (draft) => {
        draft.posts = action.payload;
      });
    case 'LOAD_USERS':
      return produce(state, (draft) => {
        draft.persons = action.payload;
      });
    case 'LOG_OUT':
      return produce(state, (draft) => {
        draft.persons = [];
      });
    default:
      return state;
  }
};

export default staffReducer;
