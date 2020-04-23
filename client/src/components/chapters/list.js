import React from 'react'
import { Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import {Link} from 'react-router-dom';

const ChaptersListRenderer = ({chapters, onDelete}) => {

  return (
    <Table hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Chapter name</th>
          <th>Chapter number</th>
          <th>Semester name</th>
          <th>Subject name</th>
          <th>Created by</th>
          <th>Active</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {
          chapters.map((chapter, index) => {
            return (
              <tr key={chapter.id}>
                <th scope="row">{index + 1}</th>
                <td>{chapter.chapter_name}</td>
                <td>{chapter.chapter_number}</td>
                <td>{chapter.semester_name}</td>
                <td>{chapter.subject_name}</td>
                <td>{chapter.admin_name}</td>
                <td>{chapter.is_active ? 'Yes' : 'No'}</td>
                <td><Link to={`/admin/chapter/edit/${chapter.slug}`}><FontAwesomeIcon icon={faEdit}/></Link></td>
                <td className="text-color-danger"><FontAwesomeIcon onClick={() => onDelete(chapter.id)} icon={faTrash}/></td>
              </tr>
            )
          })
        }
        {
          chapters.length === 0 && <tr>
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

export default ChaptersListRenderer;
