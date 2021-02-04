import {
  actionLogIn, actionLogOut, actionLoadUserData, actionLoadPermissions,
} from './actionTypes';

export const logIn = () => ({ type: actionLogIn });
export const logOut = () => ({ type: actionLogOut });
export const loadUserData = (payload) => ({ type: actionLoadUserData, payload });
export const loadPermissions = (payload) => ({ type: actionLoadPermissions, payload });
