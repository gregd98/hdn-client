import produce from 'immer';

const userReducer = (state = {}, action) => {
  switch (action.type) {
    case 'LOG_IN':
      return produce(state, (draft) => {
        draft.loggedIn = true;
        draft.userData = action.userData;
      });
    default:
      return state;
  }
};

export default userReducer;
