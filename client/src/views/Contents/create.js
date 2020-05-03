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
import {showInputFieldError} from './../../utils/validations/common';
import { validateFinallySimple } from './../../utils/validations/inputValidations';
import ServerErrors from './../../components/messages/serverError';
import ServerSuccess from './../../components/messages/serverSuccess';

import { getSemestersAction } from './../../stores/actions/semesterActions';
import { getSubjectBySemesterIdAction } from './../../stores/actions/subjectActions';
import {getChaptersBySubjectIdAction} from './../../stores/actions/chapterActions';
import {getContentYearsAction, createContentAction, getContentBySlugAction, editContentAction, clearContentAction, InputStringAction, InputErrorAction} from './../../stores/actions/contentActions';
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {content_type_label_value, difficulty_level_label_value} from './data';

const CreateContent = (props) => {

  const { 
    form,
    InputStringAction,
    InputErrorAction,
    errors,
    content,
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
    clearContentAction,
    history } = props;

  const [serverErrors, setServerErrors] = useState([]);
  const [success, setSuccess] = useState('');

  // Editing starts
  let slug = props.match.params.content_slug;
  !slug ? onSetHeading('Create Content') : onSetHeading('Edit Content');

  useEffect(() => {
    getSemestersAction();
    getContentYearsAction();

    if (slug) {
      getContentBySlugAction(slug);
    }

    return () => {
      clearContentAction();
    }
  }, []);

  const handleCKEditorChange = async (name, editor) => {
    let data = {
      name,
      value: editor.getData()
    }
    const object = {
      target: data,
      initialState: form[name]
    }
    await InputStringAction(object);
    await InputErrorAction(object)
  }

  const handleChange = async (e) => {
    const {name, value} = e.target;
    const data = {name, value};
    const object = {
      target: data,
      initialState: form[name]
    }
    await InputStringAction(object);
    await InputErrorAction(object)
  }

  const handleReactSelectChange = async (name, e) => {
    const data = {name, value: e};

    const object = {
      target: data,
      initialState: form[name]
    }
    await InputStringAction(object);
    await InputErrorAction(object)
    let id;
    if (e !== null && !Array.isArray(e)) {
      id = e.value;
    }
    if (name === 'semester') getSubjectBySemesterIdAction(id);
    if (name === 'subject') getChaptersBySubjectIdAction(id);
  }

  const handleCheckboxChange = async (e) => {
    const {name, checked} = e.target;
    const data = {name, value: checked};
    const object = {
      target: data,
      initialState: form[name]
    }
    await InputStringAction(object);
    await InputErrorAction(object)
  }

  useEffect(() => {
    if (Object.keys(content).length > 0)  {
      let semester_id = content.semester.value;
      if (semester_id) {
        getSubjectBySemesterIdAction(semester_id);
      }
  
      let subject_id = content.subject.value;
      if (subject_id) {
        getChaptersBySubjectIdAction(subject_id);
      }
    }
  }, [content]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!slug) {
      createContentAction(form)
        .then(response => {
          setSuccess(response.message)
          setServerErrors([])
          history.push('/admin/contents');
        }).catch(error => {
        });
    } else {
      editContentAction(form, form.id)
        .then(response => {
          setSuccess(response.message)
          history.push('/admin/contents');
        }).catch(error => {
        });
    }
  }

  return (
    <Col xs={12} className="create-form-body">
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col sm={7} style={{borderRight: '1px solid #c8ced3'}}>
            <InputCKEditor
              id="content_name"
              label="Content name"
              value={form.content_name.input_val}
              handleChange={(editor) => {
                handleCKEditorChange('content_name', editor)
              }}
              error={showInputFieldError(errors, 'content_name')}
              ckeditorHeightClass="ckeditor-no-height"
              />

            <InputText
              id="content_slug"
              type="text"
              name="content_slug"
              label="Content slug"
              placeholder="Content slug"
              value={form.content_slug.input_val}
              handleChange={handleChange}
              error={showInputFieldError(errors, 'content_slug')}
              />

            <InputCKEditor
              id="content_description"
              label="Content description"
              value={form.content_description.input_val}
              handleChange={(editor) => {
                handleCKEditorChange('content_description', editor)
              }}
              error={showInputFieldError(errors, 'content_description')}
              ckeditorHeightClass="ckeditor-custom-height"
              />

            <InputCheckbox
              id="is_active"
              type="checkbox"
              name="is_active"
              label="Is active"
              value={form.is_active.input_val}
              handleChange={handleCheckboxChange}
              error={showInputFieldError(errors, 'is_active')}
              />
          </Col>
          <Col sm={4} className="small-label">
            <ReactSelect
              label="Semester"
              value={form.semester.input_val}
              handleChange={(e) => handleReactSelectChange('semester', e)}
              options={semesters_label_value}
              error={showInputFieldError(errors, 'semester')}
            />

            <ReactSelect
              label="Subject"
              value={form.subject.input_val}
              handleChange={(e) => handleReactSelectChange('subject', e)}
              options={subjects_label_value}
              error={showInputFieldError(errors, 'subject')}
            />   

            <ReactSelect
              label="Chapter"
              value={form.chapter.input_val}
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
                    value={form.content_type.input_val}
                    handleChange={(e) => handleReactSelectChange('content_type', e)}
                    options={content_type_label_value}
                    error={showInputFieldError(errors, 'content_type')}
                    />
                  <ReactSelectWithoutLabel // Taking row of 6
                    label="Difficulty level"
                    value={form.difficulty_level.input_val}
                    handleChange={(e) => handleReactSelectChange('difficulty_level', e)}
                    options={difficulty_level_label_value}
                    error={showInputFieldError(errors, 'difficulty_level')}
                    />
                </Row>
              </Col>
            </FormGroup>

            <ReactSelect
              label="Years asked"
              value={form.years_asked.input_val}
              handleChange={(e) => handleReactSelectChange('years_asked', e)}
              options={content_years_label_value}
              error={showInputFieldError(errors, 'years_asked')}
              isMulti={true}
            />
          </Col>
        </Row>
        <hr />
        <Button color="primary" type="submit">Save</Button>
      </Form>
      {
        form.server_errors.length > 0 && <ServerErrors errors={form.server_errors} />
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
  clearContentAction,
  InputStringAction,
  InputErrorAction
};

function mapStateToProps (state) {
  return {
    semesters_label_value: state.Semester.semesters_label_value,
    subjects_label_value: state.Subject.subjects_label_value,
    chapters_label_value:  state.Chapter.chapters_label_value,
    content_years_label_value: state.Content.content_years_label_value,

    form: state.Content.form,
    errors: state.Content.form.client_errors,
    content: state.Content.content
  }
}

export default CreateFormHOC(connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateContent)));
