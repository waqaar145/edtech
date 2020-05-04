import React, {useState, useEffect} from 'react'
import { Table, Button, Spinner} from 'reactstrap';
import { Link } from 'react-router-dom'
import {connect} from 'react-redux';
import {getContentsAction, deleteContentAction} from './../../stores/actions/contentActions';
import './../../assets/css/error.css'
import PropTypes from 'prop-types'
import ContentListRenderer from './../../components/contents/list'
// import SubjectFilter from './../../components/subjects/filter'

const ContentsList = (props) => {

  const { contents } = props;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
    props.getContentsAction()
      .then(response => {
        setLoading(false)
      }).catch(error => {
        setLoading(false)
      })
  }, [])

  const onDelete = (id) => {
    if (window.confirm('Are you sure')) {
      props.deleteContentAction(id)
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

  if (!Array.isArray(contents)) {
    return (
      <div></div>
    )
  }

  return (
    <div>
      <div className="table-heading-row">
        <div className="table-page-heading">
          <h3>Contents</h3>
        </div>
        <div className="table-page-button">
          <Link to="/admin/content/create"><Button color="primary">Create</Button></Link>
        </div>
      </div>
      <div className="table-body-row">
        {
          loading ?
                  <center><div className="spinner-style spinner-align"><Spinner color="primary" /></div></center>
                  :
                  <ContentListRenderer contents={contents} onDelete={onDelete}/>
        }
      </div>
    </div>
  )
}

ContentsList.propTypes = {
  getContentsAction: PropTypes.func,
  deleteContentAction: PropTypes.func,
  contents: PropTypes.array
}

function mapStateToProps (state) {
  return {
    contents: state.Content.contents
  }
}
const mapDispatchToProps = {getContentsAction, deleteContentAction};

export default connect(mapStateToProps, mapDispatchToProps)(ContentsList);
