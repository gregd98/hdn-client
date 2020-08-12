import { actionLoadPosts, actionLoadPersons } from './actionTypes';

export const loadPosts = (posts) => ({ type: actionLoadPosts, payload: posts });
export const loadPersons = (persons) => ({ type: actionLoadPersons, payload: persons });
