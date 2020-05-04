import React, { useState, useEffect } from 'react';
import { Button, Col, Container, Form, Input, Row, FormGroup, Label, FormFeedback } from 'reactstrap';
import { validateFinally, stringValidation, booleanValidation } from './../../../helpers/validation';
import {connect} from 'react-redux';

import InputText from './../../../partials/forms/InputText';
import InputFile from './../../../partials/forms/InputFile';
import InputCheckbox from './../../../partials/forms/InputCheckbox';
import useForm from './../../../utils/form/useForm';
import {showInputFieldError} from './../../../utils/validations/common';
import ServerErrors from './../../../components/messages/serverError'
import ServerSuccess from './../../../components/messages/serverSuccess'

import {createBlogCategoryAction, getBlogCategoryBySlugAction, editBlogCategoryAction} from './../../../stores/actions/blogActions';
import './../../../assets/css/error.css'
import PropTypes from 'prop-types'
import CreateFormHOC from './../../../HOCs/createForm'
import { withRouter } from "react-router-dom";

const CreateBlogCategory = (props) => {

  let INITIAL_STATE = {
    category_name: {
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

  const { category, getBlogCategoryBySlugAction, onSetHeading, createBlogCategoryAction, editBlogCategoryAction, history } = props;

  const [serverErrors, setServerErrors] = useState([]);
  const [success, setSuccess] = useState('');

  // ***** setting heading name AND EDIT
  let slug = props.match.params.category_slug;
  !slug ? onSetHeading('Create Blog Category') : onSetHeading('Edit Blog Category');

  useEffect(() => {
    if (slug) {
      getBlogCategoryBySlugAction(slug);
    }

    return () => {
      // clearSemesterAction();
    }
  }, []);
  
  useEffect(() => {
    if (Object.keys(category).length > 0) {
      let data = {
        ...INITIAL_STATE,
        category_name: {
          ...INITIAL_STATE.category_name,
          input_val: category.category_name
        },
        thumbnail: {
          ...INITIAL_STATE.thumbnail,
          required: slug ? false : true,
          imgUrl: category.thumbnail,
        },
        is_active: {
          ...INITIAL_STATE.is_active,
          input_val: category.is_active
        },
        id: category.category_id,
      }

      setToInitialState(data);
    }
  }, [category])

  function submit () {
    let formData = new FormData();
    formData.append('category_name', values.category_name.input_val);
    if (typeof values.thumbnail === 'object') {
      formData.append('thumbnail', values.thumbnail.input_val)
    }
    formData.append('is_active', values.is_active.input_val)
      if (!slug) {
        createBlogCategoryAction(formData)
          .then(response => {
            setSuccess(response.message)
            setSubmittingFn()
            setServerErrors([])
            history.push('/admin/blogs/categories');
          }).catch(error => {
            setServerErrors(error.response.data.data)
            setSubmittingFn()
          })
      } else {
        editBlogCategoryAction(formData, values.id)
          .then(response => {
            setSuccess(response.message)
            setSubmittingFn()
            history.push('/admin/blogs/categories');
          }).catch(error => {
            setServerErrors(error.response.data.data)
            setSubmittingFn()
          })
      }
  }

  return (
    <Col xs={8} className="create-form-body">
      <Form onSubmit={handleSubmit}>
        <InputText
          id="category_name"
          type="text"
          name="category_name"
          label="Category name"
          placeholder="Category name"
          value={values.category_name.input_val}
          handleChange={handleChange}
          error={showInputFieldError(errors, 'category_name')}
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
        serverErrors.length > 0 && <ServerErrors errors={serverErrors} />
      }
      {
        success && <ServerSuccess message={success} />
      }
    </Col>
  )
}

CreateBlogCategory.propTypes = {
  createBlogCategoryAction: PropTypes.func,
  getBlogCategoryBySlugAction: PropTypes.func,
  editBlogCategoryAction: PropTypes.func
}

const mapDispatchToProps = { createBlogCategoryAction, getBlogCategoryBySlugAction, editBlogCategoryAction };

function mapStateToProps (state) {
  return {
    category: state.Blog.category
  }
}

export default CreateFormHOC(connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateBlogCategory)));
