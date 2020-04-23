import axios from 'axios'
let urlPrefix = 'api/v1/admin/';
export default {
  subject : {
    create : data =>
        axios.post(urlPrefix + 'subjects', data).then(res => res.data),
    getList: () =>
        axios.get(urlPrefix + 'subjects').then(res => res.data),
    getById: (slug) =>
        axios.get(urlPrefix + 'subjects/' + slug).then(res => res.data),
    edit: (data, id) =>
        axios.put(urlPrefix + 'subjects/' + id, data).then(res => res.data),
    delete: (id) =>
        axios.delete(urlPrefix + 'subjects/' + id).then(res => res.data),
    get_semesters: id =>
        axios.get(urlPrefix + 'subjects/semester/' + id).then(res => res.data),
  }
}
