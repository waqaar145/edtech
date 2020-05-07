import { GET_BLOG_CATEGORIES, GET_BLOG_CATEGORY_BY_SLUG, DELETE_BLOG_CATEGORY_BY_ID, CLEAR_BLOG_ACTION, INPUT_BLOG_STRING_ACTION, SET_BLOG_CLIENT_ERRORS, SET_BLOG_CLIENT_SUBMIT_ERRORS } from './../../types'
import api from './../apis/blog';
import {stringHtmlValidation, stringValidation, numberValidation, arrayValidation, booleanValidation, objectValidation, validateFinallySimple} from './../../utils/validations/inputValidations'

export function getBlogCategories (data) {
  return {
    type: GET_BLOG_CATEGORIES,
    data
  }
}

export function getBlogCategoryBySlug (data) {
  return {
    type: GET_BLOG_CATEGORY_BY_SLUG,
    data
  }
}

export function deleteBlogCategoryById (data) {
  return {
    type: DELETE_BLOG_CATEGORY_BY_ID,
    data
  }
}

export function clearBlogAction () {
  return {
    type: CLEAR_BLOG_ACTION
  }
}

export function InputStringAction (object) {
  return {
    type: INPUT_BLOG_STRING_ACTION,
    data: object
  }
}

export function InputError (data) {

  return {
    type: SET_BLOG_CLIENT_ERRORS,
    data
  }
}

export function setClientError (data) {
  return {
    type: SET_BLOG_CLIENT_SUBMIT_ERRORS,
    data
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


export const createBlogCategoryAction = (data) => async dispatch => {
  try {
    let result = await api.category.create(data);
    return result;
  } catch (error) {
    throw error;
  }
}

export const getBlogCategoriesAction = () => async dispatch => {
  try {
    let result = await api.category.getList();
    return dispatch(getBlogCategories(result.data))
  } catch (error) {
    throw error;
  }
}

export const getBlogCategoryBySlugAction = (slug) => async dispatch => {
  try {
    let result = await api.category.getById(slug);
    return dispatch(getBlogCategoryBySlug(result.data));
  } catch (error) {
    throw error
  }
}

export const editBlogCategoryAction = (data, id) => async dispatch => {
  try {
    let result = await api.category.edit(data, id);
    dispatch(getBlogCategoryBySlug(result.data));
    return result;
  } catch (error) {
    throw error
  }
}

export const deleteBlogCategoryAction = (id) => async dispatch => {
  try {
    let result = await api.category.delete(id);
    dispatch(deleteBlogCategoryById(id));
    return result;
  } catch (error) {
    throw error
  }
}

// CREATE BLOG
export const createBlogAction = (data) => async dispatch => {
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

export const editBlogAction = (data, id) => async dispatch => {
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
