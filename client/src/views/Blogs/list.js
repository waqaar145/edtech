import React from 'react'
import { Table, Button, Spinner} from 'reactstrap';
import { Link } from 'react-router-dom'

const BlogLists = (props) => {
  return (
    <div>
      <div className="table-heading-row">
        <div className="table-page-heading">
          <h3>Blogs</h3>
        </div>
        <div className="table-page-button">
          <Link to="/admin/blog/create"><Button color="primary">Create</Button></Link>
        </div>
      </div>
      <div className="table-body-row">
        asdf
      </div>
    </div>
  )
}

export default BlogLists;
