import { actionLoadDays, actionLoadGames } from './actionTypes';

export const loadDays = (days) => ({ type: actionLoadDays, payload: days });
export const loadGames = (games) => ({ type: actionLoadGames, payload: games });
