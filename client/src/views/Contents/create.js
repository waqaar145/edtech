import React, { useState, useEffect } from 'react'
import { Button, Col, Container, Form, Input, Row, FormGroup, Label, FormFeedback } from 'reactstrap';
import CreateFormHOC from './../../HOCs/createForm';
import { withRouter } from "react-router-dom";

import InputText from './../../partials/forms/InputText';
import InputFile from './../../partials/forms/InputFile';
import InputCheckbox from './../../partials/forms/InputCheckbox';
import ReactSelect from './../../partials/forms/ReactSelect';
import ReactSelectWithoutLabel from './../../partials/forms/ReactSelectWithoutLabel';
import InputCKEditor from './../../partials/forms/InputCKEditor';
import useForm from './../../utils/form/useForm';
import {showInputFieldError} from './../../utils/validations/common';
import ServerErrors from './../../components/messages/serverError';
import ServerSuccess from './../../components/messages/serverSuccess';

import { getSemestersAction } from './../../stores/actions/semesterActions';
import { getSubjectBySemesterIdAction } from './../../stores/actions/subjectActions';
import {getChaptersBySubjectIdAction} from './../../stores/actions/chapterActions';
import {getContentYearsAction, createContentAction, getContentBySlugAction, editContentAction} from './../../stores/actions/contentActions';
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {content_type_label_value, difficulty_level_label_value} from './data';

const CreateContent = (props) => {

  // Start - Initial state
  let INITIAL_STATE = {
        content_name: {
          input_val: '',
          required: true,
          type: {
            name: 'htmlString'
          },
          condition: {
            min: 5,
            max: 300
          }
        },
        content_slug: {
          input_val: '',
          required: true,
          type: String,
          condition: {
            min: 5,
            max: 300
          }
        },
        content_description: {
          input_val: '',
          required: true,
          type: {
            name: 'htmlString'
          },
          condition: {
            min: 50,
            max: 20000
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
        chapter: {
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
        content_type: {
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
        difficulty_level: {
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
        years_asked: {
          input_val: [],
          required: true,
          type: Array,
          condition: {
            min: 1,
            max: 5
          }
        },
        is_active: {
          input_val: false,
          required: true,
          type: Boolean
        },
        id: null
      }
  // End - Initial state

  const { 
    onSetHeading, 
    semesters_label_value, 
    subjects_label_value, 
    chapters_label_value, 
    content_years_label_value, 
    getSubjectBySemesterIdAction, 
    getChaptersBySubjectIdAction, 
    getSemestersAction, 
    getContentYearsAction, 
    createContentAction,
    editContentAction,
    getContentBySlugAction,
    history } = props;

  // Editing starts
  let slug = props.match.params.content_slug;
  !slug ? onSetHeading('Create Content') : onSetHeading('Edit Content');

  useEffect(() => {
    getSemestersAction();
    getContentYearsAction();

    if (slug) {
      getContentBySlugAction(slug);
    }
  }, []);

  const { 
    values, 
    handleChange, 
    handleCheckboxChange,
    handleReactSelectChange,
    handleCKEditorChange,
    handleSubmit, 
    setSubmittingFn,
    submitting,
    errors,
    setToInitialState,
    clearFilePlaceholder
  } = useForm(INITIAL_STATE, submit);

  const [serverErrors, setServerErrors] = useState([]);
  const [currentSemesterId, setCurrentSemesterId] = useState(null);
  const [currentSubjectId, setCurrentSubjectId] = useState(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let semester_id = values.semester.input_val.value;
    if (semester_id && semester_id !== currentSemesterId) {
      console.log('inside')
      setCurrentSemesterId(semester_id);
      getSubjectBySemesterIdAction(semester_id);
    }

    let subject_id = values.subject.input_val.value;
    if (subject_id && subject_id !== currentSubjectId) {
      setCurrentSubjectId(subject_id);
      getChaptersBySubjectIdAction(subject_id);
    }
  }, [values]);

  function submit () {
    let years_asked_data = [];
      for (let y of values.years_asked.input_val) {
        years_asked_data.push(y.value)
      }
      let final_object = {
        content_name: values.content_name.input_val,
        content_slug: values.content_slug.input_val,
        content_description: values.content_description.input_val,
        semester_id: values.semester.input_val.value,
        subject_id: values.subject.input_val.value,
        chapter_id: values.chapter.input_val.value,
        content_type: values.content_type.input_val.value,
        difficulty_level: values.difficulty_level.input_val.value,
        years_asked: years_asked_data,
        is_active: values.is_active.input_val,
      }

    if (!slug) {
      createContentAction(final_object)
        .then(response => {
          setSuccess(response.message)
          setSubmittingFn()
          setServerErrors([])
          history.push('/admin/contents');
        }).catch(error => {
          setServerErrors(error.response.data.data)
          setSubmittingFn()
        });
    } else {
      editContentAction(final_object, values.id)
        .then(response => {
          setSuccess(response.message)
          setSubmittingFn()
          history.push('/admin/contents');
        }).catch(error => {
          setServerErrors(error.response.data.data)
          setSubmittingFn()
        });
    }
  }

  return (
    <Col xs={12} className="create-form-body">
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col sm={7} style={{borderRight: '1px solid #c8ced3'}}>
            <InputCKEditor
              label="Content name"
              value={values.content_name.input_val}
              handleChange={(event, editor) => handleCKEditorChange('content_name', event, editor)}
              error={showInputFieldError(errors, 'content_name')}
              ckeditorHeightClass="ckeditor-no-height"
              />

            <InputText
              id="content_slug"
              type="text"
              name="content_slug"
              label="Content slug"
              placeholder="Content slug"
              value={values.content_slug.input_val}
              handleChange={handleChange}
              error={showInputFieldError(errors, 'content_slug')}
              />

            <InputCKEditor
              label="Content description"
              value={values.content_description.input_val}
              handleChange={(event, editor) => handleCKEditorChange('content_description', event, editor)}
              error={showInputFieldError(errors, 'content_description')}
              ckeditorHeightClass="ckeditor-custom-height"
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
          </Col>
          <Col sm={4} className="small-label">
            <ReactSelect
              label="Semester"
              value={values.semester.input_val}
              handleChange={(e) => handleReactSelectChange('semester', e)}
              options={semesters_label_value}
              error={showInputFieldError(errors, 'semester')}
            />

            <ReactSelect
              label="Subject"
              value={values.subject.input_val}
              handleChange={(e) => handleReactSelectChange('subject', e)}
              options={subjects_label_value}
              error={showInputFieldError(errors, 'subject')}
            />   

            <ReactSelect
              label="Chapter"
              value={values.chapter.input_val}
              handleChange={(e) => handleReactSelectChange('chapter', e)}
              options={chapters_label_value}
              error={showInputFieldError(errors, 'chapter')}
            />

            <FormGroup row>
              <Label for="semester" sm={2}>Types & Level</Label>
              <Col sm={10}>
                <Row>
                  <ReactSelectWithoutLabel // Taking row of 6
                    label="Theory type"
                    value={values.content_type.input_val}
                    handleChange={(e) => handleReactSelectChange('content_type', e)}
                    options={content_type_label_value}
                    error={showInputFieldError(errors, 'content_type')}
                    />
                  <ReactSelectWithoutLabel // Taking row of 6
                    label="Difficulty level"
                    value={values.difficulty_level.input_val}
                    handleChange={(e) => handleReactSelectChange('difficulty_level', e)}
                    options={difficulty_level_label_value}
                    error={showInputFieldError(errors, 'difficulty_level')}
                    />
                </Row>
              </Col>
            </FormGroup>

            <ReactSelect
              label="Years asked"
              value={values.years_asked.input_val}
              handleChange={(e) => handleReactSelectChange('years_asked', e)}
              options={content_years_label_value}
              error={showInputFieldError(errors, 'years_asked')}
              isMulti={true}
            />
          </Col>
        </Row>
        <hr />
        <Button color="primary" type="submit" disabled={submitting ? true : false}>Save</Button>
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
  editContentAction
};

function mapStateToProps (state) {
  return {
    semesters_label_value: state.Semester.semesters_label_value,
    subjects_label_value: state.Subject.subjects_label_value,
    chapters_label_value:  state.Chapter.chapters_label_value,
    content_years_label_value: state.Content.content_years_label_value
  }
}

export default CreateFormHOC(connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateContent)));
