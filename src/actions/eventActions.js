import {
  actionLoadDays, actionLoadAllGames, actionLoadMyGames,
  actionSetCurrentGameTab, actionLoadGame, actionLoadScores,
  actionLoadAllScores,
} from './actionTypes';

export const loadDays = (days) => ({ type: actionLoadDays, payload: days });
export const loadAllGames = (games) => ({ type: actionLoadAllGames, payload: games });
export const loadMyGames = (games) => ({ type: actionLoadMyGames, payload: games });
export const setCurrentTab = (currentTab) => (
  { type: actionSetCurrentGameTab, payload: currentTab });
export const loadGame = (game) => ({ type: actionLoadGame, payload: game });
export const loadScores = (gameId, scores) => (
  { type: actionLoadScores, payload: { gameId, scores } });
export const loadAllScores = (scores) => ({ type: actionLoadAllScores, payload: scores });
