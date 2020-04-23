import axios from 'axios'
let urlPrefix = 'api/v1/admin/';
export default {
  semester : {
    create : data =>
        axios.post(urlPrefix + 'semesters', data).then(res => res.data),
    getList: () =>
        axios.get(urlPrefix + 'semesters').then(res => res.data),
    getById: (slug) =>
        axios.get(urlPrefix + 'semesters/' + slug).then(res => res.data),
    edit: (data, id) =>
        axios.put(urlPrefix + 'semesters/' + id, data).then(res => res.data),
    delete: (id) =>
        axios.delete(urlPrefix + 'semesters/' + id).then(res => res.data),
  }
}
