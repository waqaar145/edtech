import {GET_SEMESTERS, GET_SEMESTERS_BY_SLUG, DELETE_SEMESTER_BY_ID, CLEAR_SEMESTER_ACTION} from './../../types.js'
let initialState = {
  semesters: [],
  semesters_label_value: [],
  semester: {}
}
export default function User (state = initialState, action = {}){

  switch (action.type) {
    case GET_SEMESTERS:
      let semesters_label_value = action.data.map((semester) => {
                                    return { value: semester.id, label: semester.name }
                                  })
      return { ...state, semesters: action.data, semesters_label_value: semesters_label_value }

    case GET_SEMESTERS_BY_SLUG:
      return {...state, semester : { ...action.data }}

    case DELETE_SEMESTER_BY_ID:
      return {...state, semesters: state.semesters.filter(semester => semester.id !== action.data)}

    case CLEAR_SEMESTER_ACTION:
      return {...state, semester: {}}

    default:
        return state;
  }
}
