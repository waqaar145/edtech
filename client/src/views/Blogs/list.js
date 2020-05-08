import React, {useState, useEffect} from 'react'
import { Table, Button, Spinner} from 'reactstrap';
import { Link } from 'react-router-dom';
import {getBlogsAction, deleteBlogAction} from './../../stores/actions/blogActions';
import BlogsListRenderer from './../../components/blogs/list'
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

const BlogLists = (props) => {

  const { blogs, deleteBlogAction } = props;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
    props.getBlogsAction()
      .then(response => {
        setLoading(false)
      }).catch(error => {
        setLoading(false)
      })
  }, [])

  const onDelete = (id) => {
    if (window.confirm('Are you sure')) {
      props.deleteBlogAction(id)
        .then(
          response => {
            // console.log(response)
          }
        ).catch(
          error => {
            console.log(error.response)
          }
        )
    } else {
      console.log('no')
    }
  }

  if (!Array.isArray(blogs)) {
    return (
      <div></div>
    )
  }

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
        {
          loading ?
                  <center><div className="spinner-style spinner-align"><Spinner color="primary" /></div></center>
                  :
                  <BlogsListRenderer blogs={blogs} onDelete={onDelete}/>
        }
      </div>
    </div>
  )
}

BlogLists.propTypes = {
  getBlogsAction: PropTypes.func,
  deleteBlogAction: PropTypes.func,
  blogs: PropTypes.array
}

function mapStateToProps (state) {
  return {
    blogs: state.Blog.blogs
  }
}
const mapDispatchToProps = {getBlogsAction, deleteBlogAction};

export default connect(mapStateToProps, mapDispatchToProps)(BlogLists);
