import produce from 'immer';

const defaultState = {
  posts: [
    { id: 1, name: 'Org' },
    { id: 2, name: 'Vol' },
  ],
  persons: [
    { id: 1, postId: 1, lastName: 'Org1' },
    { id: 2, postId: 2, lastName: 'Vol1' },
    { id: 3, postId: 1, lastName: 'Org2' },
    { id: 4, postId: 2, lastName: 'Vol2' },
  ],
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
    default:
      return state;
  }
};

export default staffReducer;
