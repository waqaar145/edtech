import React from 'react'
import { Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import {Link} from 'react-router-dom';

const SemestersListRenderer = ({semesters, onDelete}) => {

  return (
    <Table hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Semester name</th>
          <th>Thumbnail</th>
          <th>Created by</th>
          <th>Active</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {
          semesters.map((semester, index) => {
            return (
              <tr key={semester.id}>
                <th scope="row">{index + 1}</th>
                <td>{semester.name}</td>
                <td><img className="table-image-small" src={semester.thumbnail} /></td>
                <td>{semester.admin_name}</td>
                <td>{semester.is_active ? 'Yes' : 'No'}</td>
                <td><Link to={`/admin/semester/edit/${semester.slug}`}><FontAwesomeIcon icon={faEdit}/></Link></td>
                <td className="text-color-danger"><FontAwesomeIcon onClick={() => onDelete(semester.id)} icon={faTrash}/></td>
              </tr>
            )
          })
        }
        {
          semesters.length === 0 && <tr>
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

export default SemestersListRenderer;
