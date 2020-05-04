import React, {useState, useEffect} from 'react'
import { Table, Button, Spinner} from 'reactstrap';
import { Link } from 'react-router-dom'
import {connect} from 'react-redux';
import {getSubjectsAction, deleteSubjectAction} from './../../stores/actions/subjectActions';
import './../../assets/css/error.css'
import PropTypes from 'prop-types'
import SubjectListRenderer from './../../components/subjects/list'
import SubjectFilter from './../../components/subjects/filter'

const SubjectsList = (props) => {

  const { subjects } = props;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
    props.getSubjectsAction()
      .then(response => {
        setLoading(false)
      }).catch(error => {
        setLoading(false)
      })
  }, [])

  const onDelete = (id) => {
    if (window.confirm('Are you sure')) {
      props.deleteSubjectAction(id)
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

  if (!Array.isArray(subjects)) {
    return (
      <div></div>
    )
  }

  return (
    <div>
      <div className="table-heading-row">
        <div className="table-page-heading">
          <h3>Subjects</h3>
        </div>
        <div className="table-page-button">
          <Link to="/admin/subject/create"><Button color="primary">Create</Button></Link>
        </div>
      </div>
      {/* <div className="list-filter-style">
        <SubjectFilter />
      </div> */}
      <div className="table-body-row">
        <center className="spinner-align">
        {
          loading && <div className="spinner-style"><Spinner color="primary" /></div>
        }
        </center>
        {
          !loading && <SubjectListRenderer subjects={subjects} onDelete={onDelete}/>
        }
      </div>
    </div>
  )
}

SubjectsList.propTypes = {
  getSubjectsAction: PropTypes.func,
  deleteSubjectAction: PropTypes.func,
  subjects: PropTypes.array,
  subject: PropTypes.object
}

function mapStateToProps (state) {
  return {
    subjects: state.Subject.subjects
  }
}
const mapDispatchToProps = {getSubjectsAction, deleteSubjectAction};

export default connect(mapStateToProps, mapDispatchToProps)(SubjectsList);
