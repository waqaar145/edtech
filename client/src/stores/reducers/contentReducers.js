import { GET_CONTENT_YEARS, GET_CONTENTS, GET_CONTENT_BY_SLUG, DELETE_CONTENT_BY_ID, CLEAR_CONTENT, INPUT_STRING_ACTION, SET_CLIENT_ERRORS, SET_CLIENT_SUBMIT_ERRORS} from './../../types.js'

  // Start - Initial state
  let form = {
    content_name: {
      input_val: '',
      required: true,
      type: {
        name: 'htmlString'
      },
      condition: {
        min: 5,
        max: 300
      }
    },
    content_slug: {
      input_val: '',
      required: true,
      type: String,
      condition: {
        min: 5,
        max: 300
      }
    },
    content_description: {
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
    semester: {
      input_val: {
        label: '',
        value: null
      },
      required: true,
      type: Object,
      condition: {
        pattern: [
          {
            key: 'value',
            type: Number
          },
          {
            key: 'label',
            type: String
          }
        ],
      }
    },
    subject: {
      input_val: {
        label: '',
        value: null
      },
      required: true,
      type: Object,
      condition: {
        pattern: [
          {
            key: 'value',
            type: Number
          },
          {
            key: 'label',
            type: String
          }
        ],
      }
    },
    chapter: {
      input_val: {
        label: '',
        value: null
      },
      required: true,
      type: Object,
      condition: {
        pattern: [
          {
            key: 'value',
            type: Number
          },
          {
            key: 'label',
            type: String
          }
        ],
      }
    },
    content_type: {
      input_val: {
        label: '',
        value: null
      },
      required: true,
      type: Object,
      condition: {
        pattern: [
          {
            key: 'value',
            type: Number
          },
          {
            key: 'label',
            type: String
          }
        ],
      }
    },
    difficulty_level: {
      input_val: {
        label: '',
        value: null
      },
      required: true,
      type: Object,
      condition: {
        pattern: [
          {
            key: 'value',
            type: Number
          },
          {
            key: 'label',
            type: String
          }
        ],
      }
    },
    years_asked: {
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
// End - Initial state

let initialState = {
  form,
  content_years: [],
  content_years_label_value: [],
  contents: [],
  content: {}
}
export default function Content (state = initialState, action = {}){
  switch (action.type) {


    case INPUT_STRING_ACTION:

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

    case SET_CLIENT_ERRORS:
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

    case SET_CLIENT_SUBMIT_ERRORS:
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
          content_name: {
            ...state.form.content_name,
            input_val: action.data.content_name
          },
          content_slug: {
            ...state.form.content_slug,
            input_val: action.data.content_slug
          },
          content_description: {
            ...state.form.content_description,
            input_val: action.data.content_description
          },
          is_active: {
            ...state.form.is_active,
            input_val: action.data.is_active
          },
          semester: {
            ...state.form.semester,
            input_val: action.data.semester
          },
          subject: {
            ...state.form.subject,
            input_val: action.data.subject
          },
          chapter: {
            ...state.form.chapter,
            input_val: action.data.chapter
          },
          content_type: {
            ...state.form.content_type,
            input_val: action.data.content_type
          },
          difficulty_level: {
            ...state.form.difficulty_level,
            input_val: action.data.difficulty_level
          },
          years_asked: {
            ...state.form.years_asked,
            input_val: action.data.years_asked
          },
          id: action.data.id
        },
        content: action.data
      };

    case CLEAR_CONTENT:
      return {
        ...state,
        form: form
      }

    case DELETE_CONTENT_BY_ID:
      return {...state, contents: state.contents.filter(content => content.id !== action.data)}

    default:
        return state;
  }
}
