import axios from 'axios'
let urlPrefix = 'api/v1/admin/';
export default {
  content : {
    getYears : data =>
        axios.get(urlPrefix + 'contents/get_years').then(res => res.data),
    create: data =>
        axios.post(urlPrefix + 'contents', data).then(res => res.data),
    getList: () =>
        axios.get(urlPrefix + 'contents').then(res => res.data),
    getBySlug: (slug) =>
        axios.get(urlPrefix + 'contents/' + slug).then(res => res.data),
    edit: (data, id) =>
        axios.put(urlPrefix + 'contents/' + id, data).then(res => res.data),
    delete: (id) =>
        axios.delete(urlPrefix + 'contents/' + id).then(res => res.data),

  }
}
