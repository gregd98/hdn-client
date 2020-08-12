import produce from 'immer';
import {
  actionLoadTeams, actionLoadContacts, actionLoadTeam, actionLoadPlayers, actionLogOut,
} from '../actions/actionTypes';

const defaultState = {
  teams: [],
  contacts: {},
  teamsData: {},
  players: [],
};

const teamsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionLoadTeams:
      return produce(state, (draft) => {
        draft.teams = action.payload;
      });
    case actionLoadContacts:
      return produce(state, (draft) => {
        draft.contacts = action.payload;
      });
    case actionLoadTeam:
      return produce(state, (draft) => {
        draft.teamsData[action.payload.team.id] = action.payload;
      });
    case actionLoadPlayers:
      return produce(state, (draft) => {
        draft.players = action.payload;
      });
    case actionLogOut:
      return defaultState;
    default:
      return state;
  }
};

export default  teamsReducer;
