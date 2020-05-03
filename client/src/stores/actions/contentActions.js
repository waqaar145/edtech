import { GET_CONTENT_YEARS, GET_CONTENTS, GET_CONTENT_BY_SLUG, DELETE_CONTENT_BY_ID, CLEAR_CONTENT, INPUT_STRING_ACTION, SET_CLIENT_ERRORS, SET_CLIENT_SUBMIT_ERRORS } from './../../types'
import api from './../apis/content';
import {stringHtmlValidation, stringValidation, numberValidation, arrayValidation, booleanValidation, objectValidation, validateFinallySimple} from './../../utils/validations/inputValidations'

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


export function clearContentAction () {
  return {
    type: CLEAR_CONTENT
  }
}

export function InputStringAction (object) {
  return {
    type: INPUT_STRING_ACTION,
    data: object
  }
}

export function InputError (data) {

  return {
    type: SET_CLIENT_ERRORS,
    data
  }
}

export function setClientError (data) {
  return {
    type: SET_CLIENT_SUBMIT_ERRORS,
    data
  }
}

export const getContentYearsAction = () => async dispatch => {
  try {
    let result = await api.content.getYears();
    return dispatch(getContentYears(result.data));
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

export const deleteContentAction = (id) => async dispatch => {
  try {
    let result = await api.content.delete(id);
    dispatch(deleteContentById(id));
    return result;
  } catch (error) {
    throw error
  }
}

export const InputErrorAction = object => async dispatch => {
  const { target, initialState } = object;
  const { required, condition, type } = initialState;
  const { name, value } = target;
  let min, max, size, dimensions, image_type, pattern;

  if (type.name === 'String' || type.name === 'Array' || type.name === 'htmlString' || type.name === 'Number') {
    min = condition.min;
    max = condition.max;
  } else if (type.name === 'File') {
    size = condition.size;
    dimensions = condition.dimensions;
    image_type = condition.type;
  } else if (type.name === 'Object') {
    pattern = condition.pattern;
  }

  let error = {};
  if (type.name === 'htmlString') {
    error = await stringHtmlValidation(name, value, required, min, max);
  } else if (type.name === 'String') {
    error = await stringValidation(name, value, required, min, max);
  } else if (type.name === 'Object') {
    error = await objectValidation(name, value, required, pattern);
  } else if (type.name === 'Array') {
    error = await arrayValidation(name, value, required, min, max);
  } else if (type.name === 'Boolean') {
    error = await booleanValidation(name, value, required);
  } 
  dispatch(InputError({name, error}))
}

export const createContentAction = (data) => async dispatch => {
  try {
    await validateFinallySimple(data);
    let years_asked_data = [];

    for (let y of data.years_asked.input_val) {
      years_asked_data.push(y.value)
    }
    let final_object = {
      content_name: data.content_name.input_val,
      content_slug: data.content_slug.input_val,
      content_description: data.content_description.input_val,
      semester_id: data.semester.input_val.value,
      subject_id: data.subject.input_val.value,
      chapter_id: data.chapter.input_val.value,
      content_type: data.content_type.input_val.value,
      difficulty_level: data.difficulty_level.input_val.value,
      years_asked: years_asked_data,
      is_active: data.is_active.input_val,
    }

    let result = await api.content.create(final_object);
    return result
  } catch (error) {
    if (error.hasOwnProperty('error_type')) {
      dispatch(setClientError(error))
    } else {
      let obj = {
        error_type: 'SERVER',
        errors: error.response.data.data
      }
      dispatch(setClientError(obj))
    }
  }
}

export const editContentAction = (data, id) => async dispatch => {
  try {
    await validateFinallySimple(data);
    let years_asked_data = [];

    for (let y of data.years_asked.input_val) {
      years_asked_data.push(y.value)
    }
    let final_object = {
      content_name: data.content_name.input_val,
      content_slug: data.content_slug.input_val,
      content_description: data.content_description.input_val,
      semester_id: data.semester.input_val.value,
      subject_id: data.subject.input_val.value,
      chapter_id: data.chapter.input_val.value,
      content_type: data.content_type.input_val.value,
      difficulty_level: data.difficulty_level.input_val.value,
      years_asked: years_asked_data,
      is_active: data.is_active.input_val,
    }

    let result = await api.content.edit(final_object, id);
    return result;
  } catch (error) {
    if (error.hasOwnProperty('error_type')) {
      dispatch(setClientError(error))
    } else {
      let obj = {
        error_type: 'SERVER',
        errors: error.response.data.data
      }
      dispatch(setClientError(obj))
    }
  }
}