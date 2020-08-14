import produce from 'immer';
import { actionLoadDays, actionLoadGames, actionLogOut} from '../actions/actionTypes';

const defaultState = {
  days: [],
  games: [],
};

const eventReducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionLoadDays:
      return produce(state, (draft) => {
        draft.days = action.payload;
      });
    case actionLoadGames:
      return produce(state, (draft) => {
        draft.games = action.payload;
      });
    case actionLogOut:
      return defaultState;
    default:
      return state;
  }
};

export default eventReducer;
