import produce from 'immer';
import { actionLogIn, actionFetchUserData, actionLogOut } from '../actions/actionTypes';

const defaultState = {
  loggedIn: false,
  userData: {
    firstName: '',
    lastName: '',
  },
};

const userReducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionLogIn: case actionFetchUserData:
      return produce(state, (draft) => {
        draft.loggedIn = true;
        draft.userData = action.userData;
      });
    case actionLogOut:
      return defaultState;
    default:
      return state;
  }
};

export default userReducer;
