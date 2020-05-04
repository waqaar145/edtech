import React, {useState, useEffect} from 'react'
import { Table, Button, Spinner} from 'reactstrap';
import { Link } from 'react-router-dom'
import {connect} from 'react-redux';
import {getSemestersAction, deleteSemesterAction} from './../../stores/actions/semesterActions';
import './../../assets/css/error.css'
import PropTypes from 'prop-types'
import SemestersListRenderer from './../../components/semesters/list'

const SemestersList = (props) => {

  const { semesters } = props;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
    props.getSemestersAction()
      .then(response => {
        setLoading(false)
      }).catch(error => {
        setLoading(false)
      })
  }, [])

  const onDelete = (id) => {
    if (window.confirm('Are you sure')) {
      props.deleteSemesterAction(id)
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

  if (!Array.isArray(semesters)) {
    return (
      <div></div>
    )
  }

  return (
    <div>
      <div className="table-heading-row">
        <div className="table-page-heading">
          <h3>Semesters</h3>
        </div>
        <div className="table-page-button">
          <Link to="/admin/semester/create"><Button color="primary">Create</Button></Link>
        </div>
      </div>
      <div className="table-body-row">
        <center className="spinner-align">
        {
          loading && <div className="spinner-style"><Spinner color="primary" /></div>
        }
        </center>
        {
          !loading && <SemestersListRenderer semesters={semesters} onDelete={onDelete}/>
        }
      </div>
    </div>
  )
}

SemestersList.propTypes = {
  getSemestersAction: PropTypes.func,
  deleteSemesterAction: PropTypes.func,
  semesters: PropTypes.array,
  semester: PropTypes.object
}

function mapStateToProps (state) {
  return {
    semesters: state.Semester.semesters
  }
}
const mapDispatchToProps = {getSemestersAction, deleteSemesterAction};

export default connect(mapStateToProps, mapDispatchToProps)(SemestersList);
