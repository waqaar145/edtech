import { GET_SEMESTERS, GET_SEMESTERS_BY_SLUG, DELETE_SEMESTER_BY_ID, CLEAR_SEMESTER_ACTION } from './../../types'
import api from './../apis/semester';

export function getSemesters(data){
  return {
    type : GET_SEMESTERS,
    data
  }
}

export function getSemesterBySlug(data) {
  return {
    type: GET_SEMESTERS_BY_SLUG,
    data: data
  }
}

export function deleteSemesterById (id) {
  return {
    type: DELETE_SEMESTER_BY_ID,
    data: id
  }
}

export function clearSemester () {
  return {
    type: CLEAR_SEMESTER_ACTION
  }
}

export const createSemesterAction = (data) => async dispatch => {
  try {
    let result = await api.semester.create(data);
    return result;
  } catch (error) {
    throw error;
  }
}

export const getSemestersAction = () => async dispatch => {
  try {
    let result = await api.semester.getList();
    return dispatch(getSemesters(result.data))
  } catch (error) {
    throw error;
  }
}

export const getSemesterBySlugAction = (slug) => async dispatch => {
  try {
    let result = await api.semester.getById(slug);
    return dispatch(getSemesterBySlug(result.data));
  } catch (error) {
    throw error
  }
}

export const editSemesterAction = (data, id) => async dispatch => {
  try {
    let result = await api.semester.edit(data, id);
    dispatch(getSemesterBySlug(result.data));
    return result;
  } catch (error) {
    throw error
  }
}

export const deleteSemesterAction = (id) => async dispatch => {
  try {
    let result = await api.semester.delete(id);
    dispatch(deleteSemesterById(id));
    return result;
  } catch (error) {
    throw error
  }
}

export const clearSemesterAction = () => dispatch => {
  dispatch(clearSemester())
}
