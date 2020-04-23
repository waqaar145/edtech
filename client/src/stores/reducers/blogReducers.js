import {GET_BLOG_CATEGORIES, GET_SEMESTERS_BY_SLUG, DELETE_BLOG_CATEGORY_BY_ID} from './../../types.js'
let initialState = {
  categories: [],
  categories_label_value: [],
  category: {}
}
export default function Blog (state = initialState, action = {}){

  switch (action.type) {
    case GET_BLOG_CATEGORIES:
      let categories_label_value = action.data.map((category) => {
                                    return { value: category.id, label: category.name }
                                  })
      return { ...state, categories: action.data, categories_label_value: categories_label_value }

    case GET_SEMESTERS_BY_SLUG:
      return {...state, category : { ...action.data }}

    case DELETE_BLOG_CATEGORY_BY_ID:
      return {...state, categories: state.categories.filter(category => category.id !== action.data)}

    default:
        return state;
  }
}
