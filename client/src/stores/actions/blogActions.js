import { GET_BLOG_CATEGORIES, GET_BLOG_CATEGORY_BY_SLUG, DELETE_BLOG_CATEGORY_BY_ID } from './../../types'
import api from './../apis/blog';

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
