import React, {useState, useEffect} from 'react'
import { Table, Button, Spinner} from 'reactstrap';
import { Link } from 'react-router-dom'
import {connect} from 'react-redux';
import {getBlogCategoriesAction, deleteBlogCategoryAction } from './../../../stores/actions/blogActions';
import './../../../assets/css/error.css'
import PropTypes from 'prop-types'
import CategoriesListRenderer from './../../../components/blogs/categories/list'

const SemestersList = (props) => {

  const { categories } = props;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
    props.getBlogCategoriesAction()
      .then(response => {
        setLoading(false)
      }).catch(error => {
        setLoading(false)
      })
  }, [])

  const onDelete = (id) => {
    if (window.confirm('Are you sure')) {
      props.deleteBlogCategoryAction(id)
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

  if (!Array.isArray(categories)) {
    return (
      <div></div>
    )
  }

  return (
    <div>
      <div className="table-heading-row">
        <div className="table-page-heading">
          <h3>Blog categories</h3>
        </div>
        <div className="table-page-button">
          <Link to="/admin/blogs/category/create"><Button color="primary">Create</Button></Link>
        </div>
      </div>
      <div className="table-body-row">
        <center className="spinner-align">
        {
          loading && <div className="spinner-style"><Spinner color="primary" /></div>
        }
        </center>
        {
          !loading && <CategoriesListRenderer categories={categories} onDelete={onDelete}/>
        }
      </div>
    </div>
  )
}

SemestersList.propTypes = {
  getBlogCategoriesAction: PropTypes.func,
  deleteBlogCategoryAction: PropTypes.func,
  categories: PropTypes.array,
  // category: PropTypes.object
}

function mapStateToProps (state) {
  return {
    categories: state.Blog.categories
  }
}
const mapDispatchToProps = {getBlogCategoriesAction, deleteBlogCategoryAction};

export default connect(mapStateToProps, mapDispatchToProps)(SemestersList);
