import React, { useState, useEffect } from 'react';
import { Button, Col, Container, Form, Input, Row, FormGroup, Label, FormFeedback } from 'reactstrap';
import {connect} from 'react-redux';

import InputText from './../../partials/forms/InputText';
import InputFile from './../../partials/forms/InputFile';
import InputCheckbox from './../../partials/forms/InputCheckbox';
import ReactSelect from './../../partials/forms/ReactSelect';
import useForm from './../../utils/form/useForm';
import {showInputFieldError} from './../../utils/validations/common';
import ServerErrors from './../../components/messages/serverError'
import ServerSuccess from './../../components/messages/serverSuccess'

import {createSubjectAction, getSubjectBySlugAction, editSubjectAction, clearSubjectAction} from './../../stores/actions/subjectActions';
import {getSemestersAction} from './../../stores/actions/semesterActions';
import './../../assets/css/error.css'
import PropTypes from 'prop-types'
import CreateFormHOC from './../../HOCs/createForm'
import { withRouter } from "react-router-dom";

const CreateSubject = (props) => {

  let INITIAL_STATE = {
    subject_name: {
      input_val: '',
      required: true,
      type: String,
      condition: {
        min: 5,
        max: 30
      }
    },
    semester: {
      input_val: {
        label: '',
        value: null
      },
      required: true,
      type: Object,
      condition: {
        pattern: [
          {
            key: 'value',
            type: Number
          },
          {
            key: 'label',
            type: String
          }
        ],
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

  const { subject, onSetHeading, semesters_label_value, createSubjectAction, getSubjectBySlugAction, editSubjectAction, getSemestersAction, clearSubjectAction, history } = props;
  // ***** setting heading name AND EDIT
  let slug = props.match.params.subject_slug;
  !slug ? onSetHeading('Create Subject') : onSetHeading('Edit Subject');

  useEffect(() => {
    getSemestersAction();
    if (slug) {
      getSubjectBySlugAction(slug);
    }

    return () => {
      clearSubjectAction();
    }
  }, []);

  const { 
    values, 
    handleChange, 
    handleFileChange, 
    handleCheckboxChange,
    handleReactSelectChange,
    handleSubmit, 
    setSubmittingFn,
    submitting,
    errors,
    setToInitialState,
    clearFilePlaceholder
  } = useForm(INITIAL_STATE, submit);

  useEffect(() => {
    if (Object.keys(subject).length > 0) {
      let data = {
        ...INITIAL_STATE,
        subject_name: {
          ...INITIAL_STATE.subject_name,
          input_val: subject.subject_name
        },
        semester: {
          ...INITIAL_STATE.semester,
          input_val: {
            label: subject.semester_name,
            value: subject.semester_id
          }
        },
        thumbnail: {
          ...INITIAL_STATE.thumbnail,
          required: slug ? false : true,
          imgUrl: subject.thumbnail,
        },
        is_active: {
          ...INITIAL_STATE.is_active,
          input_val: subject.is_active
        },
        id: subject.subject_id,
      }

      setToInitialState(data);
    }
  }, [subject])

  const [serverErrors, setServerErrors] = useState([]);
  const [success, setSuccess] = useState('');

  function submit () {
    let formData = new FormData();
    formData.append('subject_name', values.subject_name.input_val);
    formData.append('semester_id', values.semester.input_val.value);
    if (typeof values.thumbnail === 'object') {
      formData.append('thumbnail', values.thumbnail.input_val);
    }
    formData.append('is_active', values.is_active.input_val);

    if (!slug) {
      createSubjectAction(formData)
        .then(response => {
          setSuccess(response.message)
          setSubmittingFn()
          setServerErrors([])
          history.push('/admin/subjects');
        }).catch(error => {
          console.log(error)
          setServerErrors(error.response.data.data)
          setSubmittingFn()
        });
    } else {
      editSubjectAction(formData, values.id)
        .then(response => {
          setSuccess(response.message)
          setSubmittingFn()
          history.push('/admin/subjects');
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
          id="subject_name"
          type="text"
          name="subject_name"
          label="Subject name"
          placeholder="Subject name"
          value={values.subject_name.input_val}
          handleChange={handleChange}
          error={showInputFieldError(errors, 'subject_name')}
          />
        
        <ReactSelect
          label="semester"
          value={values.semester.input_val}
          handleChange={(e) => handleReactSelectChange('semester', e)}
          options={semesters_label_value}
          error={showInputFieldError(errors, 'semester')}
         />

        <InputFile // don't use id here as used in subject name
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

CreateSubject.propTypes = {
  createSubjectAction: PropTypes.func,
  getSubjectBySlugAction: PropTypes.func,
  editSubjectAction: PropTypes.func
}

const mapDispatchToProps = { createSubjectAction, getSubjectBySlugAction, editSubjectAction, getSemestersAction, clearSubjectAction };

function mapStateToProps (state) {
  return {
    subject: state.Subject.subject,
    semesters_label_value: state.Semester.semesters_label_value
  }
}

export default CreateFormHOC(connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateSubject)));
