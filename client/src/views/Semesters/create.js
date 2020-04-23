import React, { useState, useEffect } from 'react';
import { Button, Col, Container, Form, Input, Row, FormGroup, Label, FormFeedback } from 'reactstrap';
import { validateFinally, stringValidation, booleanValidation } from './../../helpers/validation';
import {connect} from 'react-redux';
import {createSemesterAction, getSemesterBySlugAction, editSemesterAction} from './../../stores/actions/semesterActions';
import './../../assets/css/error.css'
import PropTypes from 'prop-types'
import ServerErrors from './../../components/messages/serverError'
import ServerSuccess from './../../components/messages/serverSuccess'
import CreateFormHOC from './../../HOCs/createForm'
import { withRouter } from "react-router-dom";

const CreateSemester = (props) => {

  const { semester } = props;

  let userState = {
    semester_name: '',
    thumbnail: '',
    is_active: true
  }

  let userErrState = {
    semester_name: '',
    thumbnail: '',
    is_active: ''
  }

  const [values, setValue] = useState(userState)
  const [semester_id, setSemesterId] = useState(null);
  const [thumbnail_url, setThumbnailUrl] = useState('');
  const [errors, setErrors] = useState(userErrState)
  const [serverErrors, setServerError] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  // ***** setting heading name AND EDIT
  let slug = props.match.params.semester_slug;
  useEffect(() => {
    let heading = '';
    if (!slug) {
      props.onSetHeading('Create Semester')
    } else {
      props.onSetHeading('Edit Semester')
      // get Semester detail by semester slug
      props.getSemesterBySlugAction(slug)
        .then(
          response => {
            setValue(
              {
                ...values,
                semester_name: response.data.semester_name,
                thumbnail: response.data.thumbnail,
                is_active: response.data.is_active
              }
            )
            setSemesterId(response.data.semester_id)
            setThumbnailUrl(response.data.thumbnail)
          }
        )
        .catch(
          error => {
            console.log(error)
          }
        )
    }
  }, []);
  // end setting heading name

  const handleChange = (e) => {
    let error;
    const {name, value} = e.target;

    switch (name) {
      case 'semester_name':
        error = stringValidation(value, name, 3, 35);
        setErrors({...errors, [name]: error === true ? '' : error})
        break;

      default:

    }
    setValue({...values, [name]: value})
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
    setValue({...values, [name]: checked})
  }

  const handleImage = (e) => {
    let file = e.target.files[0];
    if (!file) {
      setErrors({...errors, thumbnail: 'Please select a file'})
    }
    setValue({...values, thumbnail: file})
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateFinally(errors, values) === true) {
      setLoading(true)
      let formData = new FormData();
      let id = null;
      if (slug) {
        id = semester_id;
      }

      formData.append('semester_name', values.semester_name);
      if (typeof values.thumbnail === 'object') {
        formData.append('thumbnail', values.thumbnail)
      }
      formData.append('is_active', values.is_active)
      if (!slug) {
        props.createSemesterAction(formData)
          .then(
            response => {
              setLoading(false);
              setServerError([])
              setValue({...values, semester_name: '', thumbnail: '', is_active: false})
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
        props.editSemesterAction(formData, id)
          .then(
            response => {
              setLoading(false);
              setServerError([])
              setSuccess(response.message)
              setThumbnailUrl(response.data.thumbnail)
              props.history.push('/admin/semester/edit/' + response.data.slug);
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
          <Label for="exampleEmail" sm={2}>Semester name</Label>
          <Col sm={10}>
            <Input type="text" name="semester_name" id="semester_name" placeholder="Semester name" value={values.semester_name} onChange={handleChange} invalid={errors.semester_name !== ''}/>
            {errors.semester_name && <FormFeedback className="error">{errors.semester_name}</FormFeedback>}
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

CreateSemester.propTypes = {
  createSemesterAction: PropTypes.func,
  getSemesterBySlugAction: PropTypes.func,
  editSemesterAction: PropTypes.func
}

const mapDispatchToProps = { createSemesterAction, getSemesterBySlugAction, editSemesterAction };

function mapStateToProps (state) {
  return {
    semester: state.Semester.semester
  }
}

export default CreateFormHOC(connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateSemester)));
