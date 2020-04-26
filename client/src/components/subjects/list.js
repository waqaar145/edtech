import React from 'react'
import { Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import {Link} from 'react-router-dom';
import MyClientTable from './../../partials/table/MyCientTable';

const SubjectListRenderer = ({subjects, onDelete}) => {

  const options = {
    id: '#',
    name: 'Subject name',
    semester_name: 'Semester name',
    thumbnail: 'Thumbnail',
    admin_name: 'Created by',
    is_active: 'Active', 
    view: 'View',
    delete: 'Delete'
  };

  const columns = [
    'id',
    'name',
    'semester_name',
    'thumbnail',
    'admin_name',
    'is_active',
    'view',
    'delete'
  ];

  const sortings = ['name'];
  const filtering = ['name'];

  
  const SemesterImage = ({data}) => {
    return (
      <img src={data.thumbnail} width="50" alt={data.name} />
    )
  }

  const IsActive = ({data}) => {
    return (
      <span>{data.is_active ? 'Yes' : 'No'}</span>
    )
  }

  const ViewWidget = ({data}) => {
    return (
      <Link to={`/admin/subject/edit/${data.slug}`}><FontAwesomeIcon icon={faEdit}/></Link>
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
        data={subjects}
        total={subjects.length}
        loading={false}
        view={<ViewWidget/>}
        delete={<DeleteWidget />}
        is_active={<IsActive />}
        thumbnail={<SemesterImage />}
        >
      </MyClientTable>
    </div>
  )
}

export default SubjectListRenderer;
