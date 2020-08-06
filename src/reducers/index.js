import { combineReducers } from 'redux';
import userReducer from './userReducer';
import staffReducer from './staffRedurer';
import teamsReducer from './teamsReducer';

const rootReducer = combineReducers({
  user: userReducer,
  staff: staffReducer,
  teams: teamsReducer,
});

export default rootReducer;
