import {
  actionLoadDays, actionLoadAllGames, actionLoadMyGames, actionLoadDrafts, actionSetCurrentGameTab, actionLoadGame
} from './actionTypes';

export const loadDays = (days) => ({ type: actionLoadDays, payload: days });
export const loadAllGames = (games) => ({ type: actionLoadAllGames, payload: games });
export const loadMyGames = (games) => ({ type: actionLoadMyGames, payload: games });
export const loadDrafts = (games) => ({ type: actionLoadDrafts, payload: games });
export const setCurrentTab = (currentTab) => ({ type: actionSetCurrentGameTab, payload: currentTab });
export const loadGame = (game) => ({ type: actionLoadGame, payload: game });

