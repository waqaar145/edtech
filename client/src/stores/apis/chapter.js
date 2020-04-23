import axios from 'axios'
let urlPrefix = 'api/v1/admin/';
export default {
  chapter : {
    create : data =>
        axios.post(urlPrefix + 'chapters', data).then(res => res.data),
    getList: () =>
        axios.get(urlPrefix + 'chapters').then(res => res.data),
    getById: (slug) =>
        axios.get(urlPrefix + 'chapters/' + slug).then(res => res.data),
    edit: (data, id) =>
        axios.put(urlPrefix + 'chapters/' + id, data).then(res => res.data),
    delete: (id) =>
        axios.delete(urlPrefix + 'chapters/' + id).then(res => res.data),
    get_semesters: id =>
        axios.get(urlPrefix + 'chapters/semester/' + id).then(res => res.data),
    get_chapters: id =>
        axios.get(urlPrefix + 'chapters/subject/' + id).then(res => res.data),

  }
}
