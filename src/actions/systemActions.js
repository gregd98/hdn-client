import { actionLoadInvitations, actionLoadEvents } from './actionTypes';

export const loadInvitations = (invitations) => ({
  type: actionLoadInvitations, payload: invitations,
});

export const loadEvents = (events) => ({ type: actionLoadEvents, payload: events });
