import axios from 'axios'
let urlPrefix = 'api/v1/admin/';
export default {
  category : {
    create : data =>
        axios.post(urlPrefix + 'blog/categories', data).then(res => res.data),
    getList: () =>
        axios.get(urlPrefix + 'blog/categories').then(res => res.data),
    getById: (slug) =>
        axios.get(urlPrefix + 'blog/categories/' + slug).then(res => res.data),
    edit: (data, id) =>
        axios.put(urlPrefix + 'blog/categories/' + id, data).then(res => res.data),
    delete: (id) =>
        axios.delete(urlPrefix + 'blog/categories/' + id).then(res => res.data),
  }
}
