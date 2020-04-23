import {HANDLE_CE, HANDLE_CS, GET_CONTENT_YEARS, HANDLE_DC, HANDLE_CB, CONTENT_FORM_ERROR, UPDATE_FORM_ERRORS, RESET_CONTENT_CREATE_FORM, GET_CONTENTS, GET_CONTENT_BY_SLUG, DELETE_CONTENT_BY_ID} from './../../types.js'
let initialState = {
  form: {
    id: null,
    semester: {
      label: '',
      value: null
    },
    subject: {
      label: '',
      value: null
    },
    chapter: {
      label: '',
      value: null
    },
    content_type: {
      label: '',
      value: null
    },
    difficulty_level: {
      label: '',
      value: null
    },
    years_asked: [],
    content_name: '',
    content_slug: '',
    content_description: '',
    is_active: false
  },
  form_errors: [],
  content_years: [],
  content_years_label_value: [],
  contents: []
}
export default function User (state = initialState, action = {}){

  switch (action.type) {
    // FORM REDUCERS STARTS
    case HANDLE_CE:
      return {...state, form: {...state.form, [action.data.name]: action.data.data}};
      break;

    case HANDLE_CS:
      return {...state, form: {...state.form, content_slug: action.data}};
      break;

    case HANDLE_DC:
      const {data, name} = action.data;
      return {...state, form: {...state.form, [action.data.name]: action.data.data}}
      break;

    case HANDLE_CB:
      return {...state, form: {...state.form, [action.data.name]: action.data.data}}
      break;

    case CONTENT_FORM_ERROR:
      return {...state, form_errors: action.data};

    case UPDATE_FORM_ERRORS:
      if (!action.data.result) {
        return {...state, form_errors: state.form_errors.filter(error => error.key !== action.data.key)}
      } else {
        let indexIs = state.form_errors.findIndex(error => {
          return error.key === action.data.key
        })
        let arr = [];
        if (indexIs > -1) {
          let errors1 = state.form_errors.filter(error => error.key !== action.data.key)
          arr = [action.data.result]
          return {...state, form_errors: [...errors1, ...arr]}
        } else {
          arr = [action.data.result]
          return {...state, form_errors: [...state.form_errors, ...arr]}
        }
      }
      break;

    case RESET_CONTENT_CREATE_FORM:
      return {
        ...state,
        form: {
          ...state.form,
          id: null,
          // semester: {
          //   label: '',
          //   value: null
          // },
          // subject: {
          //   label: '',
          //   value: null
          // },
          // chapter: {
          //   label: '',
          //   value: null
          // },
          content_type: {
            label: '',
            value: null
          },
          difficulty_level: {
            label: '',
            value: null
          },
          years_asked: [],
          content_name: '',
          content_slug: '',
          content_description: '',
          is_active: false
        }
      }
      break;




    // FORM REDUCERS STARTS
    case GET_CONTENT_YEARS:
      let content_years_label_value = action.data.map((year) => {
                                  return { value: year.id, label: year.year }
                                })
      return { ...state, content_years: action.data, content_years_label_value: content_years_label_value }

    case GET_CONTENTS:
      return {...state, contents: action.data};

    case GET_CONTENT_BY_SLUG:
      return {
        ...state,
        form: {
          ...state.form,
          ...action.data
        }
      };

    case DELETE_CONTENT_BY_ID:
    return {...state, contents: state.contents.filter(content => content.id !== action.data)}

    default:
        return state;
  }
}
