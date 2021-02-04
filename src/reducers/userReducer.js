import produce from 'immer';
import {
  actionLogIn, actionLoadUserData, actionLogOut, actionLoadPermissions,
} from '../actions/actionTypes';

const defaultState = {
  loggedIn: false,
  userData: {
    firstName: '',
    lastName: '',
  },
  permissions: [],
};

const userReducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionLogIn:
      return produce(state, (draft) => {
        draft.loggedIn = true;
      });
    case actionLoadUserData:
      return produce(state, (draft) => {
        draft.userData = action.payload;
      });
    case actionLogOut:
      return defaultState;
    case actionLoadPermissions:
      return produce(state, (draft) => {
        draft.permissions = action.payload;
      });
    default:
      return state;
  }
};

export default userReducer;
