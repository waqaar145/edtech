import React from 'react'
import { Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import {Link} from 'react-router-dom';

const CategoriesListRenderer = ({categories, onDelete}) => {

  return (
    <Table hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Category name</th>
          <th>Thumbnail</th>
          <th>Created by</th>
          <th>Active</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {
          categories.map((category, index) => {
            return (
              <tr key={category.id}>
                <th scope="row">{index + 1}</th>
                <td>{category.name}</td>
                <td><img className="table-image-small" src={category.thumbnail} /></td>
                <td>{category.admin_name}</td>
                <td>{category.is_active ? 'Yes' : 'No'}</td>
                <td><Link to={`/admin/blogs/category/edit/${category.slug}`}><FontAwesomeIcon icon={faEdit}/></Link></td>
                <td className="text-color-danger"><FontAwesomeIcon onClick={() => onDelete(category.id)} icon={faTrash}/></td>
              </tr>
            )
          })
        }
        {
          categories.length === 0 && <tr>
            <td></td>
            <td></td>
            <td></td>
            <td>No data found</td>
            <th></th>
            <td></td>
            <td></td>
          </tr>
        }
      </tbody>
    </Table>
  )
}

export default CategoriesListRenderer;
