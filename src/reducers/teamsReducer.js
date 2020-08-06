import produce from 'immer';

const defaultState = {
  teams: [{ id: 1, name: 'Team 1' }, { id: 2, name: 'Team 2' }, { id: 3, name: 'Team 3' }],
  contacts: {},
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
    default:
      return state;
  }
};

export default  teamsReducer;
