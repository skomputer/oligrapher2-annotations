import Annotation from '../models/Annotation';
import { LOAD_ANNOTATIONS, UPDATE_ANNOTATION, DELETE_ANNOTATION, 
         CREATE_ANNOTATION, REORDER_ANNOTATIONS } from '../actions';
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


  case REORDER_ANNOTATIONS:
    // console.log(action.ids.map(id => state.find(a => a.id == id)));
    return action.ids.map(id => state.find(a => a.id == id));

    // return action.indexes.map(index => state[index]);

  default:
    return state;
  }
};