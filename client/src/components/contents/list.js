import React from 'react'
import { Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import {Link} from 'react-router-dom';
import MyClientTable from './../../partials/table/MyCientTable';

const ContentListRenderer = ({contents, onDelete}) => {

  const options = {
    id: '#',
    content_name: 'Content name',
    semester_name: 'Semester name',
    subject_name: 'Subject name',
    chapter_name: 'Chapter name',
    content_type: 'Content type',
    difficulty_level: 'Difficulty level',
    admin_name: 'Written by',
    is_active: 'Active', 
    view: 'View',
    delete: 'Delete'
  };

  const columns = [
    'id',
    'content_name',
    'semester_name',
    'subject_name',
    'chapter_name',
    'content_type',
    'difficulty_level',
    'admin_name',
    'is_active',
    'view',
    'delete'
  ];

  const sortings = ['name', 'chapter_name', 'semester_name', 'subject_name'];
  const filtering = ['name', 'chapter_name', 'semester_name', 'subject_name'];

  const createMarkup = (data) => {
    return {
       __html: data
    };
 };

  const ContentNameWidget = ({data}) => {
    return (
      <span dangerouslySetInnerHTML={createMarkup(data.name)}></span>
    )
  }

  const IsActive = ({data}) => {
    return (
      <span>{data.is_active ? 'Yes' : 'No'}</span>
    )
  }

  const ViewWidget = ({data}) => {
    return (
      <Link to={`/admin/content/edit/${data.slug}`}><FontAwesomeIcon icon={faEdit}/></Link>
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
        data={contents}
        total={contents.length}
        loading={false}
        content_name={<ContentNameWidget />}
        view={<ViewWidget/>}
        delete={<DeleteWidget />}
        is_active={<IsActive />}
        >
      </MyClientTable>
    </div>
  )
}

export default ContentListRenderer;
