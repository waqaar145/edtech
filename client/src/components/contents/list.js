import React from 'react'
import { Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import {Link} from 'react-router-dom';

const ContentListRenderer = ({contents, onDelete}) => {

  function createMarkup(data) {
    return {
       __html: data
    };
 };

  return (
    <Table hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Content name</th>
          <th>Semester</th>
          <th>Subject</th>
          <th>Chapter</th>
          <th>Content type</th>
          <th>Difficulty level</th>
          <th>Created by</th>
          <th>Active</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {
          contents.map((content, index) => {
            return (
              <tr key={content.id}>
                <th scope="row">{index + 1}</th>
                <td dangerouslySetInnerHTML={createMarkup(content.name)}></td>
                <td>{content.semester_name}</td>
                <td>{content.subject_name}</td>
                <td>{content.chapter_name}</td>
                <td>{content.content_type}</td>
                <td>{content.difficulty_level}</td>
                <td>{content.admin_name}</td>
                <td>{content.is_active ? 'Yes' : 'No'}</td>
                <td><Link to={`/admin/content/edit/${content.slug}`}><FontAwesomeIcon icon={faEdit}/></Link></td>
                <td className="text-color-danger"><FontAwesomeIcon onClick={() => onDelete(content.id)} icon={faTrash}/></td>
              </tr>
            )
          })
        }
        {
          contents.length === 0 && <tr>
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

export default ContentListRenderer;
