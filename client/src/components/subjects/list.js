import React from 'react'
import { Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import {Link} from 'react-router-dom';

const SubjectListRenderer = ({subjects, onDelete}) => {

  return (
    <Table hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Subject name</th>
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
          subjects.map((subject, index) => {
            return (
              <tr key={subject.id}>
                <th scope="row">{index + 1}</th>
                <td>{subject.name}</td>
                <td>{subject.semester_name}</td>
                <td><img className="table-image-small" src={subject.thumbnail} /></td>
                <td>{subject.admin_name}</td>
                <td>{subject.is_active ? 'Yes' : 'No'}</td>
                <td><Link to={`/admin/subject/edit/${subject.slug}`}><FontAwesomeIcon icon={faEdit}/></Link></td>
                <td className="text-color-danger"><FontAwesomeIcon onClick={() => onDelete(subject.id)} icon={faTrash}/></td>
              </tr>
            )
          })
        }
        {
          subjects.length === 0 && <tr>
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

export default SubjectListRenderer;
