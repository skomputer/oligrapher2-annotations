import Annotation from '../models/Annotation';
import { LOAD_ANNOTATIONS, UPDATE_ANNOTATION, DELETE_ANNOTATION, 
         CREATE_ANNOTATION, MOVE_ANNOTATION } from '../actions';
import { assign, keys, cloneDeep } from 'lodash';

export default function annotations(state = [], action) {
  switch (action.type) {

  case LOAD_ANNOTATIONS:
    return action.annotations.map(a => Annotation.setDefaults(a));

  case UPDATE_ANNOTATION:
    return [
      ...state.slice(0, action.id),
      assign({}, state[action.id], action.data),
      ...state.slice(action.id + 1)
    ];

  case DELETE_ANNOTATION:
    return [
      ...state.slice(0, action.id),
      ...state.slice(action.id + 1)
    ];

  case CREATE_ANNOTATION:
    return [...state, Annotation.defaults()];

  case MOVE_ANNOTATION:
    let annotations = cloneDeep(state);
    annotations.splice(action.toIndex, 0, annotations.splice(action.fromIndex, 1)[0]);
    return annotations;

  default:
    return state;
  }
};