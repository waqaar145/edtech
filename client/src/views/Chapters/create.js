import React, { useState, useEffect } from 'react';
import { Button, Col, Container, Form, Input, Row, FormGroup, Label, FormFeedback } from 'reactstrap';
import {connect} from 'react-redux';

import InputText from './../../partials/forms/InputText';
import InputFile from './../../partials/forms/InputFile';
import InputCheckbox from './../../partials/forms/InputCheckbox';
import ReactSelect from './../../partials/forms/ReactSelect';
import useForm from './../../utils/form/useForm';
import {showInputFieldError} from './../../utils/validations/common';
import ServerErrors from './../../components/messages/serverError';
import ServerSuccess from './../../components/messages/serverSuccess';

import {getSubjectBySemesterIdAction} from './../../stores/actions/subjectActions';
import {createChapterAction, getChapterBySlugAction, editChapterAction, clearChapterAction} from './../../stores/actions/chapterActions';
import {getSemestersAction} from './../../stores/actions/semesterActions';
import './../../assets/css/error.css'
import PropTypes from 'prop-types'
import CreateFormHOC from './../../HOCs/createForm'
import { withRouter } from "react-router-dom";
import chapter from '../../stores/apis/chapter';

const CreateChapter = (props) => {

  let INITIAL_STATE = {
        chapter_name: {
          input_val: '',
          required: true,
          type: String,
          condition: {
            min: 5,
            max: 30
          }
        },
        chapter_number: {
          input_val: '',
          required: true,
          type: Number,
          condition: {
            min: 1,
            max: 2
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
        subject: {
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
        is_active: {
          input_val: false,
          required: true,
          type: Boolean
        },
        id: null
      }

  const { chapter, onSetHeading, semesters_label_value, subjects_label_value, createChapterAction, getChapterBySlugAction, editChapterAction, getSemestersAction, getSubjectBySemesterIdAction, clearChapterAction, history } = props;

  const [serverErrors, setServerErrors] = useState([]);
  const [currentSemesterId, setCurrentSemesterId] = useState(null);
  const [success, setSuccess] = useState('');

  // ***** setting heading name AND EDIT
  let slug = props.match.params.chapter_slug;
  !slug ? onSetHeading('Create Chapter') : onSetHeading('Edit Chapter');

  useEffect(() => {
    getSemestersAction();
    if (slug) {
      getChapterBySlugAction(slug);
    }

    return () => {
      clearChapterAction();
    }
  }, []);

  const { 
    values, 
    handleChange, 
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
    let semester_id = values.semester.input_val.value;
    if (semester_id && semester_id !== currentSemesterId) {
      setCurrentSemesterId(semester_id);
      getSubjectBySemesterIdAction(semester_id);
    }
  }, [values]);

  useEffect(() => {
    if (Object.keys(chapter).length > 0) {
      let data = {
        ...INITIAL_STATE,
        chapter_name: {
          ...INITIAL_STATE.chapter_name,
          input_val: chapter.chapter_name
        },
        chapter_number: {
          ...INITIAL_STATE.chapter_number,
          input_val: chapter.chapter_number
        },
        semester: {
          ...INITIAL_STATE.semester,
          input_val: {
            label: chapter.semester_name,
            value: chapter.semester_id
          }
        },
        subject: {
          ...INITIAL_STATE.subject,
          input_val: {
            label: chapter.subject_name,
            value: chapter.subject_id
          }
        },
        is_active: {
          ...INITIAL_STATE.is_active,
          input_val: chapter.is_active
        },
        id: chapter.chapter_id,
      }

      setToInitialState(data);
    }
  }, [chapter]);

  console.log(values)

  function submit () {
    let data = {
      chapter_name: values.chapter_name.input_val,
      chapter_number: values.chapter_number.input_val,
      semester_id: values.semester.input_val.value,
      subject_id: values.subject.input_val.value,
      is_active: values.is_active.input_val
    }

    if (!slug) {
      createChapterAction(data)
        .then(response => {
          setSuccess(response.message)
          setSubmittingFn()
          setServerErrors([])
          history.push('/admin/chapters');
        }).catch(error => {
          setServerErrors(error.response.data.data)
          setSubmittingFn()
        });
    } else {
      editChapterAction(data, values.id)
        .then(response => {
          setSuccess(response.message)
          setSubmittingFn()
          history.push('/admin/chapters');
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
          id="chapter_name"
          type="text"
          name="chapter_name"
          label="Chapter name"
          placeholder="Chapter name"
          value={values.chapter_name.input_val}
          handleChange={handleChange}
          error={showInputFieldError(errors, 'chapter_name')}
          />

        <InputText
          id="chapter_number"
          type="number"
          name="chapter_number"
          label="Chapter number"
          placeholder="Chapter number"
          value={values.chapter_number.input_val}
          handleChange={handleChange}
          error={showInputFieldError(errors, 'chapter_number')}
          />

        <ReactSelect
          label="Semester name"
          value={values.semester.input_val}
          handleChange={(e) => handleReactSelectChange('semester', e)}
          options={semesters_label_value}
          error={showInputFieldError(errors, 'semester')}
          />

        <ReactSelect
          label="Subject name"
          value={values.subject.input_val}
          handleChange={(e) => handleReactSelectChange('subject', e)}
          options={subjects_label_value}
          error={showInputFieldError(errors, 'subject')}
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

CreateChapter.propTypes = {
  createChapterAction: PropTypes.func,
  getChapterBySlugAction: PropTypes.func,
  editChapterAction: PropTypes.func,
  getSemestersAction: PropTypes.func,
  getSubjectBySemesterIdAction: PropTypes.func
}

const mapDispatchToProps = { createChapterAction, getChapterBySlugAction, editChapterAction, getSemestersAction, getSubjectBySemesterIdAction, clearChapterAction };

function mapStateToProps (state) {
  return {
    chapter: state.Chapter.chapter,
    semesters_label_value: state.Semester.semesters_label_value,
    subjects_label_value: state.Subject.subjects_label_value,
  }
}

export default CreateFormHOC(connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateChapter)));
