import {GET_SUBJECTS, GET_SUBJECTS_BY_SLUG, DELETE_SUBJECT_BY_ID, CLEAR_SUBJECT_ACTION} from './../../types.js'
let initialState = {
  subjects: [],
  subjects_label_value: [],
  subject: {}
}
export default function User (state = initialState, action = {}){

  switch (action.type) {
    case GET_SUBJECTS:
      let subjects_label_value = action.data.map((subject) => {
                                  return { value: subject.id, label: subject.name }
                                })
      return { ...state, subjects: action.data, subjects_label_value: subjects_label_value }

    case GET_SUBJECTS_BY_SLUG:
      return {...state, subject : { ...action.data }}

    case DELETE_SUBJECT_BY_ID:
      return {...state, subjects: state.subjects.filter(subject => subject.id !== action.data)}

    case CLEAR_SUBJECT_ACTION:
      return {...state, subject: {}}

    default:
        return state;
  }
}
