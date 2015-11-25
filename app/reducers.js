import { combineReducers } from 'redux';
import title from './reducers/title';
import annotations from './reducers/annotations';
import position from './reducers/position';
import settings from './reducers/settings';

export default combineReducers({
  title,
  annotations,
  position,
  settings
});