import produce from 'immer';
import {
  actionLoadDays, actionLoadAllGames, actionLoadMyGames,
  actionLogOut, actionSetCurrentGameTab, actionLoadGame,
  actionLoadScores, actionLoadAllScores,
} from '../actions/actionTypes';

const defaultState = {
  days: [],
  allGames: [],
  myGames: [],
  currentTab: '',
  gamesData: {},
  scores: {},
  allScores: [],
};

const eventReducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionLoadDays:
      return produce(state, (draft) => {
        draft.days = action.payload;
      });
    case actionLoadAllGames:
      return produce(state, (draft) => {
        draft.allGames = action.payload;
      });
    case actionLoadMyGames:
      return produce(state, (draft) => {
        draft.myGames = action.payload;
      });
    case actionSetCurrentGameTab:
      return produce(state, (draft) => {
        draft.currentTab = action.payload;
      });
    case actionLoadGame:
      return produce(state, (draft) => {
        draft.gamesData[action.payload.id] = action.payload;
      });
    case actionLoadScores:
      return produce(state, (draft) => {
        draft.scores[action.payload.gameId] = action.payload.scores;
      });
    case actionLoadAllScores:
      return produce(state, (draft) => {
        draft.allScores = action.payload;
      });
    case actionLogOut:
      return defaultState;
    default:
      return state;
  }
};

export default eventReducer;
