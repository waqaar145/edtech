import React, { useState, useEffect } from 'react';
import { Col, Form, Button } from 'reactstrap';
import {connect} from 'react-redux';

import InputText from './../../partials/forms/InputText';
import InputFile from './../../partials/forms/InputFile';
import InputCheckbox from './../../partials/forms/InputCheckbox';
import useForm from './../../utils/form/useForm';
import {showInputFieldError} from './../../utils/validations/common';
import ServerErrors from './../../components/messages/serverError'
import ServerSuccess from './../../components/messages/serverSuccess'

import {createSemesterAction, getSemesterBySlugAction, editSemesterAction, clearSemesterAction} from './../../stores/actions/semesterActions';
import './../../assets/css/error.css'
import PropTypes from 'prop-types'
import CreateFormHOC from './../../HOCs/createForm'
import { withRouter } from "react-router-dom";

const CreateSemester = (props) => {

  let INITIAL_STATE = {
    semester_name: {
      input_val: '',
      required: true,
      type: String,
      condition: {
        min: 5,
        max: 30
      }
    },
    thumbnail: {
      input_val: '',
      imgUrl: '',
      required: true,
      type: File,
      condition: {
        size: 2, // in mb
        dimensions: {
          height: 200,
          width: 200
        },
        type: 'png|jpeg|jpg'
      }
    },
    is_active: {
      input_val: false,
      required: true,
      type: Boolean
    },
    id: null
  }

  const { semester, onSetHeading, createSemesterAction, getSemesterBySlugAction, editSemesterAction, clearSemesterAction, history } = props;
  // ***** setting heading name AND EDIT
  let slug = props.match.params.semester_slug;
  !slug ? onSetHeading('Create Semester') : onSetHeading('Edit Semester');

  useEffect(() => {
    if (slug) {
      getSemesterBySlugAction(slug);
    }

    return () => {
      clearSemesterAction();
    }
  }, []);

  const { 
    values, 
    handleChange, 
    handleFileChange, 
    handleCheckboxChange,
    handleSubmit, 
    setSubmittingFn,
    submitting,
    errors,
    setToInitialState,
    clearFilePlaceholder
  } = useForm(INITIAL_STATE, submit);

  useEffect(() => {
    if (Object.keys(semester).length > 0) {
      let data = {
        ...INITIAL_STATE,
        semester_name: {
          ...INITIAL_STATE.semester_name,
          input_val: semester.semester_name
        },
        thumbnail: {
          ...INITIAL_STATE.thumbnail,
          required: slug ? false : true,
          imgUrl: semester.thumbnail,
        },
        is_active: {
          ...INITIAL_STATE.is_active,
          input_val: semester.is_active
        },
        id: semester.semester_id,
      }

      setToInitialState(data);
    }
  }, [semester])

  const [serverErrors, setServerErrors] = useState([]);
  const [success, setSuccess] = useState('');

  function submit () {

    let formData = new FormData();
    formData.append('semester_name', values.semester_name.input_val);
    if (typeof values.thumbnail === 'object') {
      formData.append('thumbnail', values.thumbnail.input_val)
    }
    formData.append('is_active', values.is_active.input_val)

    if (!slug) {
      createSemesterAction(formData)
        .then(response => {
          setSuccess(response.message)
          setSubmittingFn()
          setServerErrors([])
          history.push('/admin/semesters');
        }).catch(error => {
          console.log(error)
          setServerErrors(error.response.data.data)
          setSubmittingFn()
        });
    } else {
      editSemesterAction(formData, values.id)
        .then(response => {
          setSuccess(response.message)
          setSubmittingFn()
          history.push('/admin/semesters');
        }).catch(error => {
          setServerErrors(error.response.data.data)
          setSubmittingFn()
        });
    }
  }

  return (
    <Col xs={8} className="create-form-body">
      <Form onSubmit={handleSubmit}>
        <InputText
          id="semester_name"
          type="text"
          name="semester_name"
          label="Semester name"
          placeholder="Semester name"
          value={values.semester_name.input_val}
          handleChange={handleChange}
          error={showInputFieldError(errors, 'semester_name')}
          />

        <InputFile // don't use id here as used in semester name
          type="file"
          name="thumbnail"
          label="Thumbnail"
          handleChange={handleFileChange}
          error={showInputFieldError(errors, 'thumbnail')}
          selectedimage={values.thumbnail.imgUrl}
          />

        <InputCheckbox
          id="is_active"
          type="checkbox"
          name="is_active"
          label="Is active"
          value={values.is_active.input_val}
          handleChange={handleCheckboxChange}
          error={showInputFieldError(errors, 'is_active')}
          />
        <hr />
        <Button color="primary" type="submit" disabled={submitting ? true : false}>Save</Button>
      </Form>
      <br />
      {
        (Array.isArray(serverErrors) && serverErrors.length > 0) && <ServerErrors errors={serverErrors} />
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
  editSemesterAction: PropTypes.func,
  clearSemesterAction: PropTypes.func
}

const mapDispatchToProps = { createSemesterAction, getSemesterBySlugAction, editSemesterAction, clearSemesterAction };

function mapStateToProps (state) {
  return {
    semester: state.Semester.semester
  }
}

export default CreateFormHOC(connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateSemester)));
