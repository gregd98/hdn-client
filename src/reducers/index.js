import { combineReducers } from 'redux';
import userReducer from './userReducer';
import staffReducer from './staffRedurer';
import teamsReducer from './teamsReducer';
import eventReducer from './eventReducer';

const rootReducer = combineReducers({
  user: userReducer,
  staff: staffReducer,
  teams: teamsReducer,
  event: eventReducer,
});

export default rootReducer;
