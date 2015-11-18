/*
 * action types
 */

export const LOAD_ANNOTATIONS = 'LOAD_ANNOTATIONS';
export const SHOW_ANNOTATION = 'SHOW_ANNOTATION';
export const UPDATE_ANNOTATION = 'UPDATE_ANNOTATION';
export const DELETE_ANNOTATION = 'DELETE_ANNOTATION';
export const CREATE_ANNOTATION = 'CREATE_ANNOTATION';
export const MOVE_ANNOTATION = 'MOVE_ANNOTATION';

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

export function createAnnotation() {
  return { type: CREATE_ANNOTATION };
}

export function moveAnnotation(fromIndex, toIndex) {
  return { type: MOVE_ANNOTATION, fromIndex, toIndex };
}