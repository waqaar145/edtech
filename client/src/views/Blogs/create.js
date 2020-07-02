import React, { useState, useEffect } from 'react'
import ReactHtmlParser from 'react-html-parser';
import { Button, Col, Container, Form, Input, Row, FormGroup, Label, FormFeedback } from 'reactstrap';
import {connect} from 'react-redux';
import useForm from './../../utils/form/useForm';
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
import { convertFileToBase64 } from './../../utils/validations/common';
import './../../assets/css/error.css'
import PropTypes from 'prop-types'
import CreateFormHOC from './../../HOCs/createForm'
import { withRouter } from "react-router-dom";
import {getBlogCategoriesAction, clearBlogAction, InputStringAction, InputFileAction, InputErrorAction, createBlogAction, getBlogBySlugAction, editBlogAction} from './../../stores/actions/blogActions';

const CreateBlog = (props) => {

  const { 
    form,
    InputStringAction,
    InputFileAction,
    InputErrorAction,
    errors,
    blog,
    categories, // list of tags
    onSetHeading, 
    getBlogCategoriesAction,
    createBlogAction,
    editBlogAction,
    getBlogBySlugAction,
    clearBlogAction,
    history } = props;

  const [serverErrors, setServerErrors] = useState([]);
  const [success, setSuccess] = useState('');

  // Editing starts
  let slug = props.match.params.blog_slug;
  !slug ? onSetHeading('Create Blog') : onSetHeading('Edit Blog');

  useEffect(() => {
    getBlogCategoriesAction();

    if (slug) {
      getBlogBySlugAction(slug);
    }

    return () => {
       clearBlogAction();
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
    console.log(name, value)
    const object = {
      target: data,
      initialState: form[name]
    }
    await InputStringAction(object);
    await InputErrorAction(object)
  }
    
  const handleFileChange = async (e) => {
    const { name } = e.target;
    let file = e.target.files[0];
    let { base64 } = await convertFileToBase64(file);

    let data = {
      name,
      value: file
    }
    const object = {
      target: data,
      initialState: {...form[name], imgUrl: base64}
    }

    await InputFileAction(object);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!slug) {
      createBlogAction(form)
        .then(response => {
          setSuccess(response.message)
          setServerErrors([])
          history.push('/admin/blogs');
        }).catch(error => {
        });
    } else {
      editBlogAction(form, form.id)
        .then(response => {
          setSuccess(response.message)
          history.push('/admin/blogs');
        }).catch(error => {
        });
    }
  }


  return (
    <Col xs={8} className="create-form-body">
      <Form onSubmit={handleSubmit}>
        <InputText
          id="title"
          type="text"
          name="title"
          label="Title"
          placeholder="Blog title"
          value={form.title.input_val}
          handleChange={handleChange}
          error={showInputFieldError(errors, 'title')}
          />

        <InputText
          id="description"
          type="text"
          name="description"
          label="Description"
          placeholder="Blog description"
          value={form.description.input_val}
          handleChange={handleChange}
          error={showInputFieldError(errors, 'description')}
          />  

        <InputFile // don't use id here as used in semester name
          type="file"
          name="thumbnail"
          label="Thumbnail"
          handleChange={handleFileChange}
          error={showInputFieldError(errors, 'thumbnail')}
          selectedimage={form.thumbnail.imgUrl}
          />  

        <ReactSelect
          label="Tags"
          value={form.tags.input_val}
          handleChange={(e) => handleReactSelectChange('tags', e)}
          options={categories}
          error={showInputFieldError(errors, 'tags')}
          isMulti={true}
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
        <InputCKEditor
          id="content"
          label="Content"
          value={form.content.input_val}
          handleChange={(editor) => {
            handleCKEditorChange('content', editor)
          }}
          error={showInputFieldError(errors, 'content')}
          ckeditorHeightClass="ckeditor-custom-height"
          />

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

const mapDispatchToProps = { 
  getBlogCategoriesAction,
  clearBlogAction,
  InputStringAction,
  InputFileAction,
  InputErrorAction,

  createBlogAction,
  getBlogBySlugAction,
  editBlogAction
};

function mapStateToProps (state) {
  return {
    categories: state.Blog.categories_label_value,
    form: state.Blog.form,
    errors: state.Blog.form.client_errors,
    blog: state.Blog.blog
  }
}

export default CreateFormHOC(connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateBlog)));
