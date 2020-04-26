import { GET_SUBJECTS, GET_SUBJECTS_BY_SLUG, DELETE_SUBJECT_BY_ID, CLEAR_SUBJECT_ACTION } from './../../types'
import api from './../apis/subject';

export function getSubjects(data){
  return {
    type : GET_SUBJECTS,
    data
  }
}

export function getSubjectBySlug(data) {
  return {
    type: GET_SUBJECTS_BY_SLUG,
    data: data
  }
}

export function deleteSubjectById (id) {
  return {
    type: DELETE_SUBJECT_BY_ID,
    data: id
  }
}

export function clearSubjectAction () {
  return {
    type: CLEAR_SUBJECT_ACTION
  }
}

export const createSubjectAction = (data) => async dispatch => {
  try {
    let result = await api.subject.create(data);
    return result;
  } catch (error) {
    throw error;
  }
}

export const getSubjectsAction = () => async dispatch => {
  try {
    let result = await api.subject.getList();
    return dispatch(getSubjects(result.data))
  } catch (error) {
    throw error;
  }
}

export const getSubjectBySlugAction = (slug) => async dispatch => {
  try {
    let result = await api.subject.getById(slug);
    return dispatch(getSubjectBySlug(result.data));
  } catch (error) {
    throw error
  }
}

export const editSubjectAction = (data, id) => async dispatch => {
  try {
    let result = await api.subject.edit(data, id);
    dispatch(getSubjectBySlug(result.data));
    return result;
  } catch (error) {
    throw error
  }
}

export const deleteSubjectAction = (id) => async dispatch => {
  try {
    let result = await api.subject.delete(id);
    dispatch(deleteSubjectById(id));
    return result;
  } catch (error) {
    throw error
  }
}

export const getSubjectBySemesterIdAction = (id) => async dispatch => {
  try {
    let result = await api.subject.get_semesters(id);
    return dispatch(getSubjects(result.data));
  } catch (error) {
    throw error
  }
}
