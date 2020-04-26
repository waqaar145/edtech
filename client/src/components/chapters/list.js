import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import {Link} from 'react-router-dom';
import MyClientTable from './../../partials/table/MyCientTable';

const ChaptersListRenderer = ({chapters, onDelete}) => {

  const options = {
    id: '#',
    chapter_name: 'Chapter name',
    chapter_number: 'Chapter number',
    semester_name: 'Semester name',
    subject_name: 'Subject name',
    admin_name: 'Created by',
    is_active: 'Active', 
    view: 'View',
    delete: 'Delete'
  };

  const columns = [
    'id',
    'chapter_name',
    'chapter_number',
    'semester_name',
    'subject_name',
    'admin_name',
    'is_active',
    'view',
    'delete'
  ];

  const sortings = ['chapter_name', 'semester_name', 'subject_name'];
  const filtering = ['chapter_name', 'semester_name', 'subject_name'];

  const IsActive = ({data}) => {
    return (
      <span>{data.is_active ? 'Yes' : 'No'}</span>
    )
  }

  const ViewWidget = ({data}) => {
    return (
      <Link to={`/admin/chapter/edit/${data.slug}`}><FontAwesomeIcon icon={faEdit}/></Link>
    )
  }

  const DeleteWidget = ({data}) => {
    return (
      <FontAwesomeIcon style={{color: 'red'}} onClick={() => onDelete(data.id)} icon={faTrash}/>
    )
  }

  return (
    <div>
      <MyClientTable 
        options={options} 
        columns={columns} 
        sortings={sortings}
        filtering={filtering}
        data={chapters}
        total={chapters.length}
        loading={false}
        view={<ViewWidget/>}
        delete={<DeleteWidget />}
        is_active={<IsActive />}
        >
      </MyClientTable>
    </div>
  )
}

export default ChaptersListRenderer;
