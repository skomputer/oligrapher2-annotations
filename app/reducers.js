import { combineReducers } from 'redux';
import annotations from './reducers/annotations';
import position from './reducers/position';

export default combineReducers({
  annotations,
  position,
});