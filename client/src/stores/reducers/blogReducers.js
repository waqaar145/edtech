import {GET_BLOG_CATEGORIES, GET_SEMESTERS_BY_SLUG, DELETE_BLOG_CATEGORY_BY_ID, GET_BLOG_CATEGORY_BY_SLUG, INPUT_BLOG_STRING_ACTION, SET_BLOG_CLIENT_ERRORS, SET_BLOG_CLIENT_SUBMIT_ERRORS, GET_BLOGS, GET_BLOG_BY_SLUG, DELETE_BLOG_BY_ID} from './../../types.js'

  // Start - Initial state
  let form = {
    title: {
      input_val: '',
      required: true,
      type: String,
      condition: {
        min: 5,
        max: 300
      }
    },
    description: {
      input_val: '',
      required: true,
      type: {
        name: 'htmlString'
      },
      condition: {
        min: 50,
        max: 20000
      }
    },
    tags: {
      input_val: [],
      required: true,
      type: Array,
      condition: {
        min: 1,
        max: 5
      }
    },
    is_active: {
      input_val: false,
      required: true,
      type: Boolean
    },
    client_errors: [],
    server_errors: [],
    id: null
  }

  let initialState = {
    form,
    categories: [],
    categories_label_value: [],
    category: {},
    blogs: [],
    blog: {}
  }
export default function Blog (state = initialState, action = {}){

  switch (action.type) {

    case INPUT_BLOG_STRING_ACTION:

      const { target} = action.data;
      const { name, value} = target;

      return {
        ...state,
        form: {
          ...state.form,
          [name]: {
            ...state.form[name],
            input_val: value
          }
        }
      };

    case SET_BLOG_CLIENT_ERRORS:
      if (action.data.error) {
        let indexIs = state.form.client_errors.findIndex(e => {
          return e.key === action.data.name;
        });
        if (indexIs > -1) {
          return {
            ...state,
            form: {
              ...state.form,
              client_errors: [...state.form.client_errors.filter(error => error.key !== action.data.name), action.data.error]
            }
          }
        } else {
          return {
            ...state,
            form: {
              ...state.form,
              client_errors: [...state.form.client_errors, action.data.error]
            }
          }
        }
      } else {
        return {
          ...state,
          form: {
            ...state.form,
            client_errors: state.form.client_errors.filter(error => error.key !== action.data.name)
          }
        }
      }

    case SET_BLOG_CLIENT_SUBMIT_ERRORS:
      if (action.data.error_type === 'CLIENT') {
        return {
          ...state,
          form: {
            ...state.form,
            client_errors: action.data.errors
          }
        }
      } else {
        return {
          ...state,
          form: {
            ...state.form,
            server_errors: action.data.errors
          }
        }
      }

    case GET_BLOG_CATEGORIES:
      let categories_label_value = action.data.map((category) => {
                                    return { value: category.id, label: category.name }
                                  })
      return { ...state, categories: action.data, categories_label_value: categories_label_value }

    case GET_SEMESTERS_BY_SLUG:
      return {...state, category : { ...action.data }}

    case DELETE_BLOG_CATEGORY_BY_ID:
      return {...state, categories: state.categories.filter(category => category.id !== action.data)}

    case GET_BLOG_CATEGORY_BY_SLUG:
      return {...state, category : { ...action.data }}

    // blogs
    case GET_BLOGS:
      return { ...state, blogs: action.data }

    case DELETE_BLOG_BY_ID:
      return {...state, blogs: state.blogs.filter(blog => blog.id !== action.data)}

    case GET_BLOG_BY_SLUG:
      return {
        ...state,
        form: {
          ...state.form,
          title: {
            ...state.form.title,
            input_val: action.data.title
          },
          description: {
            ...state.form.description,
            input_val: action.data.description
          },
          tags: {
            ...state.form.tags,
            input_val: action.data.tags
          },
          is_active: {
            ...state.form.is_active,
            input_val: action.data.is_active
          },
          id: action.data.id
        }
      }

    default:
        return state;
  }
}
