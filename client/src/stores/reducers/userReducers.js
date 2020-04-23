import {LOGGED_IN_USER} from './../../types.js'
let initialState = {
  uid: '',
  uuid: '',
  name: '',
  email: '',
  slug: ''
}
export default function User (state = initialState, action = {}){

  switch(action.type){
    case LOGGED_IN_USER:
      return {...state, ...action.data}

    default:
        return state;
  }
}
