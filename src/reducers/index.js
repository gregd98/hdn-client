import { combineReducers } from 'redux';
import userReducer from './userReducer';
import staffReducer from './staffRedurer';
import teamsReducer from './teamsReducer';
import eventReducer from './eventReducer';
import systemReducer from './systemReducer';

const rootReducer = combineReducers({
  user: userReducer,
  staff: staffReducer,
  teams: teamsReducer,
  event: eventReducer,
  system: systemReducer,
});

export default rootReducer;
