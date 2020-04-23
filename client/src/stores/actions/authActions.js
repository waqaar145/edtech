import { LOGGED_IN_USER } from './../../types'
import api from './../apis/auth';

export function signInNow(data){
  return {
    type : LOGGED_IN_USER,
    data
  }
}

export const signupAction = (data) => async dispatch => {
  try {
    let result = await api.auth.signup(data);
    return dispatch(signInNow(result))
  } catch (error) {
    throw error;
  }
}

export const signinAction = (data) => async dispatch => {
  try {
    let result = await api.auth.signin(data);
    return dispatch(signInNow(result))
  } catch (error) {
    throw error;
  }
}

export const checkLoggedIn = async () => {

  try {
    let result = await api.auth.loggedIn();
    return {
      User: {
        uid: result.uid,
        uuid: result.uuid,
        name: result.user_name,
        email: result.user_email,
        slug: result.user_slug
      }
    }
  } catch (error) {
    return {
      User: {
        uid: '',
        uuid: '',
        name: '',
        email: '',
        slug: ''
      }
    }
  }
}

export const logoutaction = () => async dispatch => {
  try {
    let result = await api.auth.logout();
    return dispatch(signInNow({
      uid: '',
      uuid: '',
      name: '',
      email: '',
      slug: ''
    }))
  } catch (error) {
    throw error;
  }
}
