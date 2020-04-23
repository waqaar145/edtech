import React, { useState, useEffect } from 'react';
import { Button, Col, Container, Form, Input, Row, FormGroup, Label, FormFeedback } from 'reactstrap';
import { validateFinally, stringValidation, booleanValidation } from './../../helpers/validation';
import {connect} from 'react-redux';
import {createSubjectAction, getSubjectBySlugAction, editSubjectAction} from './../../stores/actions/subjectActions';
import {getSemestersAction} from './../../stores/actions/semesterActions';
import './../../assets/css/error.css'
import PropTypes from 'prop-types'
import ServerErrors from './../../components/messages/serverError'
import ServerSuccess from './../../components/messages/serverSuccess'
import CreateFormHOC from './../../HOCs/createForm'
import Select from 'react-select';
import { withRouter } from "react-router-dom";

const CreateSubject = (props) => {

  const { subject, semesters_label_value } = props;

  let userState = {
    subject_name: '',
    semester: {
      label: '',
      value: null
    },
    thumbnail: '',
    is_active: true
  }

  let userErrState = {
    subject_name: '',
    semester_id: '',
    thumbnail: '',
    is_active: ''
  }

  const [values, setValues] = useState(userState)
  const [subject_id, setSubjectId] = useState(null);
  const [thumbnail_url, setThumbnailUrl] = useState('');
  const [errors, setErrors] = useState(userErrState)
  const [serverErrors, setServerError] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  // ***** setting heading name AND EDIT
  let slug = props.match.params.subject_slug;
  useEffect(() => {
    let heading = '';
    if (!slug) {
      props.onSetHeading('Create Subject')
    } else {
      props.onSetHeading('Edit Subject')
      // get Semester detail by semester slug
      props.getSubjectBySlugAction(slug)
        .then(
          response => {
            console.log(response)
            setValues(
              {
                ...values,
                subject_name: response.data.subject_name,
                semester: {
                  value: response.data.semester_id,
                  label: response.data.semester_name
                },
                thumbnail: response.data.thumbnail,
                is_active: response.data.is_active
              }
            )
            setSubjectId(response.data.subject_id)
            setThumbnailUrl(response.data.thumbnail)
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
      case 'subject_name':
        error = stringValidation(value, name, 3, 50);
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

  const handleImage = (e) => {
    let file = e.target.files[0];
    if (!file) {
      setErrors({...errors, thumbnail: 'Please select a file'})
    }
    setValues({...values, thumbnail: file})
  }

  const handleDropdownChange = (data) => {
    setValues({...values, semester: data})
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let data = {
      subject_name: values.subject_name,
      semester: values.semester.value,
      thumbnail: values.thumbnail,
      is_active: values.is_active
    }
    if (validateFinally(errors, data) === true) {
      setLoading(true)
      let formData = new FormData();
      let id = null;
      if (slug) {
        id = subject_id;
      }

      formData.append('subject_name', values.subject_name);
      formData.append('semester_id', values.semester.value);
      if (typeof values.thumbnail === 'object') {
        formData.append('thumbnail', values.thumbnail)
      }
      formData.append('is_active', values.is_active)
      if (!slug) {
        props.createSubjectAction(formData)
          .then(
            response => {
              setLoading(false);
              setServerError([])
              setValues({...values, subject_name: '', semester: {label: '', value: ''}, thumbnail: '', is_active: false})
              setSuccess(response.message)
              document.getElementById("thumbnail").value = ""; // reset the input field
            }
          ).catch(
            error => {
              setLoading(false);
              if (error.response.status === 422) {
                setServerError([...error.response.data.data])
              }
            }
          )
      } else {
        props.editSubjectAction(formData, id)
          .then(
            response => {
              setLoading(false);
              setServerError([])
              setSuccess(response.message)
              setThumbnailUrl(response.data.thumbnail)
              props.history.push('/admin/subject/edit/' + response.data.slug);
            }
          ).catch(
            error => {
              setLoading(false);
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
          <Label for="exampleEmail" sm={2}>Subject name</Label>
          <Col sm={10}>
            <Input type="text" name="subject_name" id="subject_name" placeholder="Subject name" value={values.subject_name} onChange={handleChange} invalid={errors.subject_name !== ''}/>
            {errors.subject_name && <FormFeedback className="error">{errors.subject_name}</FormFeedback>}
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="semester" sm={2}>Semester name</Label>
          <Col sm={10}>
            <Select
              value={values.semester}
              onChange={handleDropdownChange}
              options={semesters_label_value}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="exampleEmail" sm={2}>Thumbnail</Label>
          <Col sm={10}>
            <Input type="file" name="thumbnail" id="thumbnail" placeholder="Thumbnail name" onChange={handleImage} invalid={errors.thumbnail !== ''}/>
            {errors.thumbnail && <FormFeedback className="error">{errors.thumbnail}</FormFeedback>}
          </Col>
        </FormGroup>
        {slug && <FormGroup row>
          <Label for="exampleEmail" sm={2}></Label>
          <Col sm={10}>
            <img src={thumbnail_url} width="100"/>
          </Col>
        </FormGroup>}
        <FormGroup row>
          <Label for="exampleEmail" sm={2}>Active</Label>
          <Col sm={10}>
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

CreateSubject.propTypes = {
  createSubjectAction: PropTypes.func,
  getSubjectBySlugAction: PropTypes.func,
  editSubjectAction: PropTypes.func
}

const mapDispatchToProps = { createSubjectAction, getSubjectBySlugAction, editSubjectAction, getSemestersAction };

function mapStateToProps (state) {
  return {
    subject: state.Subject.subject,
    semesters_label_value: state.Semester.semesters_label_value
  }
}

export default CreateFormHOC(connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateSubject)));
