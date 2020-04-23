import { GET_CONTENT_YEARS, HANDLE_CE, HANDLE_CS, HANDLE_DC, HANDLE_CB, CONTENT_FORM_ERROR, UPDATE_FORM_ERRORS, RESET_CONTENT_CREATE_FORM, GET_CONTENTS, GET_CONTENT_BY_SLUG, DELETE_CONTENT_BY_ID } from './../../types'
import api from './../apis/content';

// INPUT FIELDS
export function handleCE (data) {
  return {
    type: HANDLE_CE,
    data
  }
}

export function handleCS (data) {
  return {
    type: HANDLE_CS,
    data
  }
}

// dropdown
export function handleDC (data) {
  return {
    type: HANDLE_DC,
    data
  }
}

// checkbox
export function handleCB (data) {
  return {
    type: HANDLE_CB,
    data
  }
}

// form error
export function formError (data) {
  return {
    type: CONTENT_FORM_ERROR,
    data
  }
}

export function updateFormErrors (data) {
  return {
    type: UPDATE_FORM_ERRORS,
    data
  }
}

export function resetContentCreateForm () {
  return {
    type: RESET_CONTENT_CREATE_FORM
  }
}

// API Calls
export function getContentYears(data){
  return {
    type : GET_CONTENT_YEARS,
    data
  }
}

export function getContents (data) {
  return {
    type: GET_CONTENTS,
    data
  }
}

export function getContentBySlug (data) {
  return {
    type: GET_CONTENT_BY_SLUG,
    data
  }
}

export function deleteContentById (data) {
  return {
    type: DELETE_CONTENT_BY_ID,
    data
  }
}

// INPUT FIELDS ACTION
export const handleCEAction = (data, name) => async dispatch => {
  let object = {
    data: data,
    name: name
  }
  dispatch(handleCE(object))
}

export const handleCSAction = (data) => async dispatch => {
  dispatch(handleCS(data))
}

// dropdown
export const handleDCAction = (data, name) => async dispatch => {
  let object = {
    data: data,
    name: name
  }
  dispatch(handleDC(object))
}

// checkbox
export const handleCBAction = (name, checked) => async dispatch => {
  dispatch(handleCB({name: name, data: checked}))
}

// form error
export const formErrorAction = (data) => async dispatch => {
  dispatch(formError(data))
}

export const updateFormErrorsAction = (result, key) => async dispatch => {
  dispatch(updateFormErrors({result, key}))
}

export const resetContentCreateFormAction = () => async dispatch => {
  dispatch(resetContentCreateForm())
}

export const getContentYearsAction = () => async dispatch => {
  try {
    let result = await api.content.getYears();
    return dispatch(getContentYears(result.data));
  } catch (error) {
    throw error;
  }
}

export const createContentAction = (data) => async dispatch => {
  try {
    let result = await api.content.create(data);
    return result
  } catch (error) {
    throw error;
  }
}

export const getContentsAction = () => async dispatch => {
  try {
    let result = await api.content.getList();
    dispatch(getContents(result.data))
    return result
  } catch (error) {
    throw error;
  }
}

export const getContentBySlugAction = (slug) => async dispatch => {
  try {
    let result = await api.content.getBySlug(slug);
    return dispatch(getContentBySlug(result.data));
  } catch (error) {
    throw error
  }
}

export const editContentAction = (data, id) => async dispatch => {
  try {
    let result = await api.content.edit(data, id);
    dispatch(getContentBySlug(result.data));
    return result;
  } catch (error) {
    throw error
  }
}

export const deleteContentAction = (id) => async dispatch => {
  try {
    let result = await api.content.delete(id);
    dispatch(deleteContentById(id));
    return result;
  } catch (error) {
    throw error
  }
}
