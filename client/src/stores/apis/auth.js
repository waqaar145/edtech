import axios from 'axios'
let urlPrefix = 'api/v1/admin/';
export default {
  auth : {
    signup : data =>
            axios.post(urlPrefix + 'auth/signup', data).then(res => res.data),
    signin : data =>
            axios.post(urlPrefix + 'auth/signin', data).then(res => res.data),
    loggedIn: () =>
            axios.get(urlPrefix + 'auth/logged-in').then(res => res.data),
    logout: () =>
            axios.get(urlPrefix + 'auth/logout').then(res => res.data)
  }
}
