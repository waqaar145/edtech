import React, {useState, useEffect} from 'react'
import { Table, Button, Spinner} from 'reactstrap';
import { Link } from 'react-router-dom'
import {connect} from 'react-redux';
import {getChaptersAction, deleteChapterAction} from './../../stores/actions/chapterActions';
import './../../assets/css/error.css'
import PropTypes from 'prop-types'
import ChaptersListRenderer from './../../components/chapters/list'
// import SubjectFilter from './../../components/subjects/filter'

const ChaptersList = (props) => {

  const { chapters } = props;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
    props.getChaptersAction()
      .then(response => {
        setLoading(false)
      }).catch(error => {
        setLoading(false)
      })
  }, [])

  const onDelete = (id) => {
    if (window.confirm('Are you sure')) {
      props.deleteChapterAction(id)
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

  if (!Array.isArray(chapters)) {
    return (
      <div></div>
    )
  }

  return (
    <div>
      <div className="table-heading-row">
        <div className="table-page-heading">
          <h3>Chapters</h3>
        </div>
        <div className="table-page-button">
          <Link to="/admin/chapter/create"><Button color="primary">Create</Button></Link>
        </div>
      </div>
      <div className="table-body-row">
        {
          loading ?
                  <center><div className="spinner-style spinner-align"><Spinner color="primary" /></div></center>
                  :
                  <ChaptersListRenderer chapters={chapters} onDelete={onDelete}/>
        }
      </div>
    </div>
  )
}

ChaptersList.propTypes = {
  getChaptersAction: PropTypes.func,
  deleteChapterAction: PropTypes.func,
  chapters: PropTypes.array,
  chapter: PropTypes.object
}

function mapStateToProps (state) {
  return {
    chapters: state.Chapter.chapters
  }
}
const mapDispatchToProps = {getChaptersAction, deleteChapterAction};

export default connect(mapStateToProps, mapDispatchToProps)(ChaptersList);
