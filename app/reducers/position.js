import { LOAD_ANNOTATIONS, SHOW_ANNOTATION, DELETE_ANNOTATION, REORDER_ANNOTATIONS } from '../actions';

export default function position(state = { currentIndex: 0 }, action) {
  switch (action.type) {

  case SHOW_ANNOTATION:
    return { currentIndex: action.id };

  case DELETE_ANNOTATION:
    return { currentIndex: Math.max(0, state.currentIndex - 1) };

  case REORDER_ANNOTATIONS:    
    return { currentIndex: action.indexes.indexOf(state.currentIndex) };

  default:
    return state;
  }
};