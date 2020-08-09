import produce from 'immer';

const defaultState = {
  teams: [],
  contacts: {},
  teamsData: {},
  players: [],
};

const teamsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'LOAD_TEAMS':
      return produce(state, (draft) => {
        draft.teams = action.payload;
      });
    case 'LOAD_CONTACTS':
      return produce(state, (draft) => {
        draft.contacts = action.payload;
      });
    case 'LOAD_TEAM':
      return produce(state, (draft) => {
        draft.teamsData[action.payload.team.id] = action.payload;
      });
    case 'LOAD_PLAYERS':
      return produce(state, (draft) => {
        draft.players = action.payload;
      });
    case 'LOG_OUT':
      return defaultState;
    default:
      return state;
  }
};

export default  teamsReducer;
