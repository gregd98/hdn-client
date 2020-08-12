import { actionLogIn, actionLogOut, actionFetchUserData } from './actionTypes';

export const logIn = (userData) => ({ type: actionLogIn, userData });
export const logOut = () => ({ type: actionLogOut });
export const fetchUserData = (userData) => ({ type: actionFetchUserData, userData });
