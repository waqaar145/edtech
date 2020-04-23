import React, { useState, useEffect } from 'react';
import { Button, Col, Container, Form, Input, Row, FormGroup, Label, FormFeedback } from 'reactstrap';
import { validateFinally, stringValidation, numberValidation, booleanValidation } from './../../helpers/validation';
import {connect} from 'react-redux';
import {getSubjectBySemesterIdAction} from './../../stores/actions/subjectActions';
import {createChapterAction, getChapterBySlugAction, editChapterAction} from './../../stores/actions/chapterActions';
import {getSemestersAction} from './../../stores/actions/semesterActions';
import './../../assets/css/error.css'
import PropTypes from 'prop-types'
import ServerErrors from './../../components/messages/serverError'
import ServerSuccess from './../../components/messages/serverSuccess'
import CreateFormHOC from './../../HOCs/createForm'
import Select from 'react-select';
import { withRouter } from "react-router-dom";

const CreateChapter = (props) => {

  const { subject, semesters_label_value, subjects_label_value } = props;

  let userState = {
    chapter_name: '',
    chapter_number: '',
    semester: {
      label: '',
      value: null
    },
    subject: {
      label: '',
      value: null
    },
    is_active: true
  }

  let userErrState = {
    chapter_name: '',
    chapter_number: '',
    semester_id: '',
    subject_id: '',
    is_active: ''
  }

  const [values, setValues] = useState(userState)
  const [chapter_id, setChapterId] = useState(null);
  const [errors, setErrors] = useState(userErrState)
  const [serverErrors, setServerError] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  // ***** setting heading name AND EDIT
  let slug = props.match.params.chapter_slug;
  useEffect(() => {
    let heading = '';
    if (!slug) {
      props.onSetHeading('Create Chapter')
    } else {
      props.onSetHeading('Edit Chapter')
      // get Semester detail by semester slug
      props.getChapterBySlugAction(slug)
        .then(
          response => {
            setValues(
              {
                ...values,
                chapter_name: response.data.chapter_name,
                chapter_number: response.data.chapter_number,
                semester: {
                  value: response.data.semester_id,
                  label: response.data.semester_name
                },
                subject: {
                  value: response.data.subject_id,
                  label: response.data.subject_name
                },
                is_active: response.data.is_active
              }
            )
            setChapterId(response.data.chapter_id)
          }
        )
        .catch(
          error => {
            console.log(error)
          }
        )
    }

    // Prefetching all the semesters
    props.getSemestersAction();
  }, []);
  // end setting heading name

  const handleChange = (e) => {
    let error;
    const {name, value} = e.target;
    switch (name) {
      case 'chapter_name':
        error = stringValidation(value, name, 10, 200);
        setErrors({...errors, [name]: error === true ? '' : error})
        break;

      case 'chapter_number':
        error = numberValidation(value, name, 1, 30);
        setErrors({...errors, [name]: error === true ? '' : error})
        break;

      default:

    }
    setValues({...values, [name]: value})
  }

  const handleChecked = (e) => {
    let error;
    const {name, checked} = e.target;

    switch (name) {
      case 'is_active':
        error = booleanValidation(checked, name);
        setErrors({...errors, [name]: error === true ? '' : error})
        break;

      default:

    }
    setValues({...values, [name]: checked})
  }

  const handleDropdownChangeSemester = (data) => {
    props.getSubjectBySemesterIdAction(data.value)
    setValues({...values, semester: data})
  }

  const handleDropdownChangeSubject = (data) => {
    setValues({...values, subject: data})
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let data = {
      chapter_name: values.chapter_name,
      chapter_number: values.chapter_number,
      semester_id: values.semester.value,
      subject_id: values.subject.value,
      is_active: values.is_active
    }
    if (validateFinally(errors, data) === true) {
      setLoading(true)

      let id = null;
      if (slug) {
        id = chapter_id;
      }

      if (!slug) {
        props.createChapterAction(data)
          .then(
            response => {
              setLoading(false);
              setServerError([])
              setValues({...values, chapter_name: '', chapter_number: '', semester: {label: '', value: ''}, subject: {label: '', value: ''}, is_active: false})
              setSuccess(response.message)
            }
          ).catch(
            error => {
              setLoading(false);
              setSuccess('')
              if (error.response.status === 422) {
                setServerError([...error.response.data.data])
              }
            }
          )
      } else {
        props.editChapterAction(data, id)
          .then(
            response => {
              setLoading(false);
              setServerError([])
              setSuccess(response.message)
              props.history.push('/admin/chapter/edit/' + response.data.slug);
            }
          ).catch(
            error => {
              setLoading(false);
              setSuccess('')
              if (error.response.status === 422) {
                setServerError([...error.response.data.data])
              }
            }
          )
      }
    }
  }

  return (
    <Col xs={8} className="create-form-body">
      <Form onSubmit={handleSubmit}>
        <FormGroup row>
          <Label for="exampleEmail" sm={3}>Chapter name</Label>
          <Col sm={9}>
            <Input type="text" name="chapter_name" id="chapter_name" placeholder="Chapter name" value={values.chapter_name} onChange={handleChange} invalid={errors.chapter_name !== ''}/>
            {errors.chapter_name && <FormFeedback className="error">{errors.chapter_name}</FormFeedback>}
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="exampleEmail" sm={3}>Chapter number</Label>
          <Col sm={9}>
            <Input type="text" name="chapter_number" id="chapter_number" placeholder="Chapter number" value={values.chapter_number} onChange={handleChange} invalid={errors.chapter_number !== ''}/>
            {errors.chapter_number && <FormFeedback className="error">{errors.chapter_number}</FormFeedback>}
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="semester" sm={3}>Semester name</Label>
          <Col sm={9}>
            <Select
              value={values.semester}
              onChange={handleDropdownChangeSemester}
              options={semesters_label_value}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="semester" sm={3}>Subject name</Label>
          <Col sm={9}>
            <Select
              value={values.subject}
              onChange={handleDropdownChangeSubject}
              options={subjects_label_value}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="exampleEmail" sm={3}>Active</Label>
          <Col sm={9}>
            <Input type="checkbox" name="is_active" checked={values.is_active} onChange={handleChecked}/>
          </Col>
        </FormGroup>
        <hr />
        <Button color="primary" type="submit" disabled={loading ? true : false}>Save</Button>
      </Form>
      <br />
      {
        serverErrors.length > 0 && <ServerErrors errors={serverErrors} />
      }
      {
        success && <ServerSuccess message={success} />
      }
    </Col>
  )
}

CreateChapter.propTypes = {
  createChapterAction: PropTypes.func,
  getChapterBySlugAction: PropTypes.func,
  editChapterAction: PropTypes.func,
  getSemestersAction: PropTypes.func,
  getSubjectBySemesterIdAction: PropTypes.func
}

const mapDispatchToProps = { createChapterAction, getChapterBySlugAction, editChapterAction, getSemestersAction, getSubjectBySemesterIdAction };

function mapStateToProps (state) {
  return {
    subject: state.Subject.subject,
    semesters_label_value: state.Semester.semesters_label_value,
    subjects_label_value: state.Subject.subjects_label_value,
  }
}

export default CreateFormHOC(connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateChapter)));
