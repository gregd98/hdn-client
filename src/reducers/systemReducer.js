import produce from 'immer';
import { actionLoadInvitations, actionLoadEvents } from '../actions/actionTypes';

const defaultState = {
  invitations: [],
  events: [],
};

const systemReducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionLoadInvitations:
      return produce(state, (draft) => {
        draft.invitations = action.payload;
      });
    case actionLoadEvents:
      return produce(state, (draft) => {
        draft.events = action.payload;
      });
    default:
      return state;
  }
};

export default systemReducer;
