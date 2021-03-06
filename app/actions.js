/*
 * action types
 */

export const LOAD_ANNOTATIONS = 'LOAD_ANNOTATIONS';
export const SHOW_ANNOTATION = 'SHOW_ANNOTATION';
export const UPDATE_ANNOTATION = 'UPDATE_ANNOTATION';
export const DELETE_ANNOTATION = 'DELETE_ANNOTATION';
export const CREATE_ANNOTATION = 'CREATE_ANNOTATION';
export const MOVE_ANNOTATION = 'MOVE_ANNOTATION';
export const SET_TITLE = 'SET_TITLE';
export const SET_SETTINGS = 'SET_SETTINGS';

/*
 * action creators
 */

export function loadAnnotations(annotations) {
  return { type: LOAD_ANNOTATIONS, annotations };
}

export function showAnnotation(id) {
  return { type: SHOW_ANNOTATION, id };
}

export function updateAnnotation(id, data) {
  return { type: UPDATE_ANNOTATION, id, data };
}

export function deleteAnnotation(id) {
  return { type: DELETE_ANNOTATION, id };
}

export function createAnnotation(newIndex) {
  return { type: CREATE_ANNOTATION, newIndex };
}

export function moveAnnotation(fromIndex, toIndex) {
  return { type: MOVE_ANNOTATION, fromIndex, toIndex };
}

export function setTitle(title) {
  return { type: SET_TITLE, title };
}

export function setSettings(settings) {
  return { type: SET_SETTINGS, settings };
}