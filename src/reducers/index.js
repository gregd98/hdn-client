import { combineReducers } from 'redux';
import userReducer from './userReducer';
import staffReducer from './staffRedurer';

const rootReducer = combineReducers({
  user: userReducer,
  staff: staffReducer,
});

export default rootReducer;
