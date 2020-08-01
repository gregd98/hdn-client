import produce from 'immer';

const defaultState = {
  loggedIn: false,
  userData: {
    firstName: '',
    lastName: '',
  },
};

const userReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'LOG_IN': case 'FETCH_USER_DATA':
      return produce(state, (draft) => {
        draft.loggedIn = true;
        draft.userData = action.userData;
      });
    case 'LOG_OUT':
      return produce(state, (draft) => {
        draft.loggedIn = false;
        draft.userData = {
          firstName: '',
          lastName: '',
        };
      });
    default:
      return state;
  }
};

export default userReducer;
