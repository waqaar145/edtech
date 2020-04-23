import React, { useState, useEffect } from 'react'
import { Button, Col, Container, Form, Input, Row, FormGroup, Label, FormFeedback } from 'reactstrap';
import { validateFinallyWithOptional, showError, customStyles } from './../../helpers/validateFinallyRedux';
import { stringHtmlValidationRedux, stringValidationRedux, numberValidationRedux, arrayValidationRedux, booleanValidationRedux } from './../../helpers/validationRedux';
import Select from 'react-select';
import CreateFormHOC from './../../HOCs/createForm';
import { withRouter } from "react-router-dom";
import {getSemestersAction} from './../../stores/actions/semesterActions';
import {getSubjectBySemesterIdAction} from './../../stores/actions/subjectActions';
import {getChaptersBySubjectIdAction} from './../../stores/actions/chapterActions';
import {getContentYearsAction, createContentAction, handleCEAction, handleCSAction, handleDCAction, handleCBAction, formErrorAction, updateFormErrorsAction, getContentBySlugAction, editContentAction, resetContentCreateFormAction} from './../../stores/actions/contentActions';
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ServerErrors from './../../components/messages/serverError'
import ServerSuccess from './../../components/messages/serverSuccess'
import {content_type_label_value, difficulty_level_label_value} from './data';

const CreateContent = (props) => {

  const { semesters_label_value, subjects_label_value, chapters_label_value, content_years_label_value, form, form_errors } = props;

  // Editing starts
  let slug = props.match.params.content_slug;
  useEffect(() => {
    let heading = '';
    if (!slug) {
      props.resetContentCreateFormAction()
      props.onSetHeading('Create Content')
    } else {
      props.onSetHeading('Edit Content')
      props.getContentBySlugAction(slug)
        .then()
        .catch()
    }

    props.getSemestersAction();
    props.getContentYearsAction();
  }, []);

  let initial_state = {
    semester: {
      data: form.semester.value,
      required: true,
      type: Number,
      condition: {
        min: 1,
        max: 8
      }
    },
    subject: {
      data: form.subject.value,
      required: true,
      type: Number,
      condition: {
        min: 1,
        max: 6
      }
    },
    chapter: {
      data: form.chapter.value,
      required: true,
      type: Number,
      condition: {
        min: 1,
        max: 25
      }
    },
    content_type: {
      data: form.content_type.value,
      required: true,
      type: Number,
      condition: {
        min: 1,
        max: 200
      }
    },
    difficulty_level: {
      data: form.difficulty_level.value,
      required: false,
      type: Number,
      condition: {
        min: 1,
        max: 300
      }
    },
    years_asked: {
      data: form.years_asked,
      required: false,
      type: Array,
      condition: {
        min: 0,
        max: 5
      }
    },
    content_name: {
      data: form.content_name,
      required: true,
      type: String,
      condition: {
        min: 1,
        max: 10000
      }
    },
    content_slug: {
      data: form.content_slug,
      required: true,
      type: String,
      condition: {
        min: 1,
        max: 500
      }
    },
    content_description: {
      data: form.content_description,
      required: true,
      type: String,
      condition: {
        min: 1,
        max: 20000
      }
    },
    is_active: {
      data: form.is_active,
      required: true,
      type: Boolean
    },
  }

  const [serverErrors, setServerError] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const handleDropdownChangeSemester = (data) => {
    props.getSubjectBySemesterIdAction(data.value)
    props.handleDCAction(data, 'semester');
    const { required, type, condition } = initial_state.semester;
    let result = numberValidationRedux(data.value, 'semester', required, type, condition.min, condition.max);
    props.updateFormErrorsAction(result, 'semester');
  }

  const handleDropdownChangeSubject = (data) => {
    props.getChaptersBySubjectIdAction(data.value)
    props.handleDCAction(data, 'subject')
    const { required, type, condition } = initial_state.subject;
    let result = numberValidationRedux(data.value, 'subject', required, type, condition.min, condition.max)
    props.updateFormErrorsAction(result, 'subject')
  }

  const handleDropdownChangeChapter = (data) => {
    props.handleDCAction(data, 'chapter')
    const { required, type, condition } = initial_state.chapter;
    let result = numberValidationRedux(data.value, 'chapter', required, type, condition.min, condition.max)
    props.updateFormErrorsAction(result, 'chapter')
  }

  const handleDropdownChangeTheory = (data) => {
    props.handleDCAction(data, 'content_type')
    const { required, type, condition } = initial_state.content_type;
    let result = numberValidationRedux(data.value, 'content_type', required, type, condition.min, condition.max)
    props.updateFormErrorsAction(result, 'content_type')
  }

  const handleDropdownChangeDifficulty = (data) => {
    props.handleDCAction(data, 'difficulty_level')
    const { required, type, condition } = initial_state.difficulty_level;
    let result = numberValidationRedux(data.value, 'difficulty_level', required, type, condition.min, condition.max);
    props.updateFormErrorsAction(result, 'difficulty_level')
  }

  const handleDropdownChangeContentYears = (data) => {
    props.handleDCAction(!data ? [] : data, 'years_asked');
    const { required, type, condition } = initial_state.years_asked;
    let result = arrayValidationRedux(!data ? [] : data, 'years_asked', required, type, condition.min, condition.max);
    props.updateFormErrorsAction(result, 'years_asked')
  }


  // redux persist implementation
  const handleContentNameEditor = (event, editor) => {
    const data = editor.getData();
    props.handleCEAction(data, 'content_name') // content name editor
    const { required, type, condition } = initial_state.content_name;
    let result = stringHtmlValidationRedux(data, 'content_name', required, type, condition.min, condition.max)
    props.updateFormErrorsAction(result, 'content_name')
  }

  const handleContentSlug = (e) => {
    const {name, value} = e.target;
    props.handleCSAction(value) // content slug
    const { required, type, condition } = initial_state.content_slug;
    let result = stringValidationRedux(value, 'content_slug', required, type, condition.min, condition.max)
    props.updateFormErrorsAction(result, 'content_slug')
  }

  const handleContentDescriptionEditor = (event, editor) => {
    const data = editor.getData();
    props.handleCEAction(data, 'content_description') // content description editor
    const { required, type, condition } = initial_state.content_description;
    let result = stringHtmlValidationRedux(data, 'content_description', required, type, condition.min, condition.max)
    props.updateFormErrorsAction(result, 'content_description')
  }

  const handleChecked = (e) => {
    const {name, checked} = e.target;
    props.handleCBAction(name, checked)
    const { required, type } = initial_state.content_description;
    let result = booleanValidationRedux(checked, 'is_active', required, type)
    props.updateFormErrorsAction(result, 'is_active')
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateFinallyWithOptional(initial_state).length === 0) {
      props.formErrorAction(validateFinallyWithOptional([])) // emptying form_errors array in redux
      // data to be sent to server
      let years_asked_data = [];
      for (let y of initial_state.years_asked.data) {
        years_asked_data.push(y.value)
      }
      let final_object = {
        semester_id: initial_state.semester.data,
        subject_id: initial_state.subject.data,
        chapter_id: initial_state.chapter.data,
        content_type: initial_state.content_type.data,
        difficulty_level: initial_state.difficulty_level.data,
        years_asked: years_asked_data,
        content_name: initial_state.content_name.data,
        content_slug: initial_state.content_slug.data,
        content_description: initial_state.content_description.data,
        is_active: initial_state.is_active.data,
      }
      if (!slug) {
        props.createContentAction(final_object)
          .then(response => {
            setLoading(false);
            setServerError([])
            // empty form data from redux store here
            props.resetContentCreateFormAction()
            setSuccess(response.message)
          }).catch(error => {
            setLoading(false);
            setSuccess('')
            if (error.response.status === 422) {
              setServerError([...error.response.data.data])
            }
          })
      } else {
        props.editContentAction(final_object, form.id)
          .then(response => {
            setLoading(false);
            setServerError([])
            setSuccess(response.message)
            props.history.push('/admin/content/edit/' + response.data.slug);
            window.location.reload();
          }).catch(error => {
            setLoading(false);
            setSuccess('')
            if (error.response.status === 422) {
              setServerError([...error.response.data.data])
            }
          })
      }
    } else {
      props.formErrorAction(validateFinallyWithOptional(initial_state))
    }
  }

  return (
    <Col xs={12} className="create-form-body">
      <Row>
        <Col sm={7} style={{borderRight: '1px solid #c8ced3'}}>
          <FormGroup row>
            <Label for="exampleEmail" sm={2}>Content title</Label>
            <Col sm={10} className="ckeditor-no-height">
              <CKEditor
                  editor={ ClassicEditor }
                  data={form.content_name}
                  onInit={ editor => {} }
                  onChange={handleContentNameEditor}
              />
              {showError(form_errors, 'content_name') && <span className="react-select-danger-feedback">{showError(form_errors, 'content_name')}</span>}
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="exampleEmail" sm={2}>Slug</Label>
            <Col sm={10}>
              <Input type="text" name="content_slug" id="content_slug" placeholder="Content slug" value={form.content_slug} onChange={handleContentSlug} invalid={showError(form_errors, 'content_slug') !== ''}/>
              {showError(form_errors, 'content_slug') && <span className="react-select-danger-feedback">{showError(form_errors, 'content_slug')}</span>}
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="exampleEmail" sm={2}>Content</Label>
            <Col sm={10} className="ckeditor-custom-height">
              <CKEditor
                  editor={ ClassicEditor }
                  data={form.content_description}
                  onInit={ editor => {} }
                  onChange={handleContentDescriptionEditor}
              />
              {showError(form_errors, 'content_description') && <span className="react-select-danger-feedback">{showError(form_errors, 'content_description')}</span>}
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="exampleEmail" sm={2}>Active</Label>
            <Col sm={10}>
              <Input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChecked}/>
              {showError(form_errors, 'is_active') && <span className="react-select-danger-feedback">{showError(form_errors, 'is_active')}</span>}
            </Col>
          </FormGroup>
        </Col>
        <Col sm={4} className="small-label">
          <FormGroup row>
            <Label for="semester" sm={4}>Semester name</Label>
            <Col sm={8}>
              <Select
                value={form.semester}
                onChange={handleDropdownChangeSemester}
                options={semesters_label_value}
                styles={showError(form_errors, 'semester') ? customStyles : ''}
              />
              {showError(form_errors, 'semester') && <span className="react-select-danger-feedback">{showError(form_errors, 'semester')}</span>}
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="semester" sm={4}>Subject name</Label>
            <Col sm={8}>
              <Select
                value={form.subject}
                onChange={handleDropdownChangeSubject}
                options={subjects_label_value}
                styles={showError(form_errors, 'subject') ? customStyles : ''}
              />
              {showError(form_errors, 'subject') && <span className="react-select-danger-feedback">{showError(form_errors, 'subject')}</span>}
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="semester" sm={4}>Chapter name</Label>
            <Col sm={8}>
              <Select
                value={form.chapter}
                onChange={handleDropdownChangeChapter}
                options={chapters_label_value}
                styles={showError(form_errors, 'chapter') ? customStyles : ''}
              />
              {showError(form_errors, 'chapter') && <span className="react-select-danger-feedback">{showError(form_errors, 'chapter')}</span>}
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="semester" sm={4}>Types & Level</Label>
            <Col sm={8}>
              <Row>
                <Col sm={6}>
                  <span className="lable-heading">Theory type</span>
                  <Select
                    value={form.content_type}
                    onChange={handleDropdownChangeTheory}
                    options={content_type_label_value}
                    styles={showError(form_errors, 'content_type') ? customStyles : ''}
                  />
                  {showError(form_errors, 'content_type') && <span className="react-select-danger-feedback">{showError(form_errors, 'content_type')}</span>}
                </Col>
                <Col sm={6}>
                  <span className="lable-heading">Difficulty level</span>
                  <Select
                    value={form.difficulty_level}
                    onChange={handleDropdownChangeDifficulty}
                    options={difficulty_level_label_value}
                    styles={showError(form_errors, 'difficulty_level') ? customStyles : ''}
                  />
                  {showError(form_errors, 'difficulty_level') && <span className="react-select-danger-feedback">{showError(form_errors, 'difficulty_level')}</span>}
                </Col>
              </Row>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="semester" sm={4}>Years asked</Label>
            <Col sm={8}>
              <Select
                value={form.years_asked}
                onChange={handleDropdownChangeContentYears}
                options={content_years_label_value}
                isMulti
                styles={showError(form_errors, 'years_asked') ? customStyles : ''}
              />
              {showError(form_errors, 'years_asked') && <span className="react-select-danger-feedback">{showError(form_errors, 'years_asked')}</span>}
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Form onSubmit={handleSubmit}>
        <Button color="primary" type="submit" disabled={loading ? true : false}>Save</Button>
      </Form>
      {
        serverErrors.length > 0 && <ServerErrors errors={serverErrors} />
      }
      {
        success && <ServerSuccess message={success} />
      }
    </Col>
  )
}

CreateContent.propTypes = {
  getSemestersAction: PropTypes.func
}

const mapDispatchToProps = {
  getSemestersAction,
  getSubjectBySemesterIdAction,
  getChaptersBySubjectIdAction,
  getContentYearsAction,
  createContentAction,
  getContentBySlugAction,
  editContentAction,
  // INPUT FIELDS
  // content description
  handleCEAction,
  handleCSAction,
  // dropdown
  handleDCAction,
  // checkbox
  handleCBAction,
  // form error
  formErrorAction,
  updateFormErrorsAction,
  resetContentCreateFormAction
};

function mapStateToProps (state) {
  return {
    semesters_label_value: state.Semester.semesters_label_value,
    subjects_label_value: state.Subject.subjects_label_value,
    chapters_label_value:  state.Chapter.chapters_label_value,
    content_years_label_value: state.Content.content_years_label_value,
    form: state.Content.form,
    form_errors: state.Content.form_errors
  }
}

export default CreateFormHOC(connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateContent)));
