import { LOAD_ANNOTATIONS, SHOW_ANNOTATION, DELETE_ANNOTATION, MOVE_ANNOTATION } from '../actions';
import { range } from 'lodash';

export default function position(state = { currentIndex: 0 }, action) {
  switch (action.type) {

  case SHOW_ANNOTATION:
    return { currentIndex: action.id };

  case DELETE_ANNOTATION:
    return { currentIndex: Math.max(0, state.currentIndex - 1) };

  case MOVE_ANNOTATION:
    let { fromIndex, toIndex } = action;
    let indexes = range(Math.max(fromIndex, toIndex, state.currentIndex) + 1);
    indexes.splice(toIndex, 0, indexes.splice(fromIndex, 1)[0]);
    return { currentIndex: indexes.indexOf(state.currentIndex) };

  default:
    return state;
  }
};