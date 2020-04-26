import { GET_CHAPTERS, GET_CHAPTER_BY_SLUG, DELETE_CHAPTER_BY_ID, CLEAR_CHAPTER } from './../../types'
import api from './../apis/chapter';

export function getChapters(data){
  return {
    type : GET_CHAPTERS,
    data
  }
}

export function getChapterBySlug(data) {
  return {
    type: GET_CHAPTER_BY_SLUG,
    data: data
  }
}

export function deleteChapterById (id) {
  return {
    type: DELETE_CHAPTER_BY_ID,
    data: id
  }
}

export function clearChapterAction () {
  return {
    type: CLEAR_CHAPTER
  }
}

export const createChapterAction = (data) => async dispatch => {
  try {
    let result = await api.chapter.create(data);
    return result;
  } catch (error) {
    throw error;
  }
}

export const getChaptersAction = () => async dispatch => {
  try {
    let result = await api.chapter.getList();
    return dispatch(getChapters(result.data))
  } catch (error) {
    throw error;
  }
}

export const getChapterBySlugAction = (slug) => async dispatch => {
  try {
    let result = await api.chapter.getById(slug);
    return dispatch(getChapterBySlug(result.data));
  } catch (error) {
    throw error
  }
}

export const editChapterAction = (data, id) => async dispatch => {
  try {
    let result = await api.chapter.edit(data, id);
    dispatch(getChapterBySlug(result.data));
    return result;
  } catch (error) {
    throw error
  }
}

export const deleteChapterAction = (id) => async dispatch => {
  try {
    let result = await api.chapter.delete(id);
    dispatch(deleteChapterById(id));
    return result;
  } catch (error) {
    throw error
  }
}

export const getChaptersBySubjectIdAction = id => async dispatch => {
  try {
    let result = await api.chapter.get_chapters(id);
    return dispatch(getChapters(result.data));
  } catch (error) {
    throw error
  }
}
