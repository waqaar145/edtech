import React, { useState, useEffect } from 'react';
import { Col, FormGroup, Label } from 'reactstrap';
import Select from 'react-select';
import {connect} from 'react-redux'
import {getSemestersAction} from './../../stores/actions/semesterActions';
import {getSubjectBySemesterIdAction} from './../../stores/actions/subjectActions';
import PropTypes from 'prop-types'

const SubjectFilter = (props) => {

  const {semesters_label_value} = props;

  const [values, setValues] = useState({label: '', value: ''})

  const handleDropdownChange = (data) => {
    setValues({...values, ...data});
  }

  useEffect(() => {
    props.getSemestersAction();
  }, [])

  useEffect(() => {
    if (values.value) {
      props.getSubjectBySemesterIdAction(values.value)
        .then(response => {
          console.log(response)
        }).catch(error => {
          console.log(error.response)
        })
    }
  }, [values])

  return (
    <div>
      <FormGroup row>
        <label sm={2}><b>Filter:</b></label>
        <Col sm={2}>
          <Select
            value={values}
            onChange={handleDropdownChange}
            options={semesters_label_value}
          />
        </Col>
      </FormGroup>
    </div>
  )
}

SubjectFilter.propTypes = {
  semesters_label_value: PropTypes.array
}
const mapDispatchToProps = {getSemestersAction, getSubjectBySemesterIdAction};

function mapStateToProps (state) {
  return {
    semesters_label_value: state.Semester.semesters_label_value
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SubjectFilter);
