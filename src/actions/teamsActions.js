import {
  actionLoadTeams, actionLoadContacts, actionLoadTeam, actionLoadPlayers,
} from './actionTypes';

export const loadTeams = (teams) => ({ type: actionLoadTeams, payload: teams });
export const loadContacts = (contacts) => ({ type: actionLoadContacts, payload: contacts });
export const loadTeam = (team) => ({ type: actionLoadTeam, payload: team });
export const loadPlayers = (players) => ({ type: actionLoadPlayers, payload: players });
