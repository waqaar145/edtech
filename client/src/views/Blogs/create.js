import React, { useState, useEffect } from 'react'
import { Button, Col, Container, Form, Input, Row, FormGroup, Label, FormFeedback } from 'reactstrap';
import {connect} from 'react-redux';
import {getBlogCategoriesAction} from './../../stores/actions/blogActions';
import './../../assets/css/error.css'
import PropTypes from 'prop-types'
import ServerErrors from './../../components/messages/serverError'
import ServerSuccess from './../../components/messages/serverSuccess'
import CreateFormHOC from './../../HOCs/createForm'
import { withRouter } from "react-router-dom";
import Select from 'react-select';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {stringValidation, numberValidation, emailValidation, imageValidation} from './../../helpers/validateForm'
import useAsdf from './test';

const CreateBlog = (props) => {

  let state = {
    title: {
      input_val: '',
      required: true,
      type: String,
      condition: {
        min: 1,
        max: 8
      }
    },
    tags: {
      input_val: [],
      required: false,
      type: Array,
      condition: {
        min: 0,
        max: 5
      }
    },
    description: {
      input_val: '',
      required: true,
      type: String,
      condition: {
        min: 1,
        max: 20000
      }
    },
    is_active: {
      input_val: false,
      required: true,
      type: Boolean
    },
    current_key: ''
  }

  let slug = props.match.params.blog_slug;
  const {categories} = props;

  const [values, setValues] = useState(state);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    let heading = '';
    if (!slug) {
      props.onSetHeading('Create Blog');
    } else {
      props.onSetHeading('Edit Blog');
    }
    props.getBlogCategoriesAction();

  }, []);

  const handleI = (object) => {
    const { target, initialState } = object;
    const {name, value} = target;

    setValues({
      ...values, 
      [name]: {
        ...state[name],
        input_val: value
      },
      current_key: name
    });
  }

  useEffect(() => {
    async function setInput () {
      if (!values.current_key) return;
      let error = {};
      let current_key = values.current_key;
      
      const { input_val, required, condition, type } = values[current_key];

      let min, max, size, dimensions, image_type;
      if (type.name !== 'File') {
        min = condition.min;
        max = condition.max;
      } else {
        size = condition.size;
        dimensions = condition.dimensions;
        image_type = condition.type;
      }

      if (values[current_key].type.name === 'String') {
        error = await stringValidation(current_key, input_val, required, min, max);
      } else if ([values[current_key]].type.name === 'Number') {
        error = await numberValidation(current_key, input_val, required, min, max);
      } else if ([values[current_key]].type.name === 'Email') {
        error = await emailValidation(current_key, input_val, required)
      } 
      console.log(error);
    }
    setInput()
  }, [values]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const object = {
      target: {name, value},
      initialState: values[name]
    }
    handleI(object);
  }

  const handleDropdownChange = (data) => {

  }

  const handleContentNameEditor = (event, editor) => {

  }


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(values)
  }

  const { title, tags, description, is_active } = values;

  return (
    <Col xs={8} className="create-form-body">
      <Form onSubmit={handleSubmit}>
        <FormGroup row>
          <Label for="exampleEmail" sm={2}>Title</Label>
          <Col sm={10}>
            <Input type="text" name="title" id="title" placeholder="Title" value={title.input_val} onChange={handleChange} invalid={errors.title !== ''}/>
            {errors.title && <FormFeedback className="error">{errors.title}</FormFeedback>}
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="semester" sm={2}>Categories (Tags)</Label>
          <Col sm={10}>
            <Select
              value={categories.input_val}
              onChange={handleDropdownChange}
              options={categories}
              isMulti
            />
            {/* {errors.categories && <span className="react-select-danger-feedback">{errors.categories}</span>} */}
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="semester" sm={2}>Description</Label>
          <Col sm={10} className="ckeditor-custom-height">
            <CKEditor
                editor={ ClassicEditor }
                data={description.input_val}
                onInit={ editor => {} }
                onChange={handleContentNameEditor}
            />
            {errors.description && <span className="react-select-danger-feedback">{errors.description}</span>}
          </Col>
        </FormGroup>
        <hr />
        <Button color="primary" type="submit" >Save</Button>
      </Form>
    </Col>
  )
}

const mapDispatchToProps = { getBlogCategoriesAction };

function mapStateToProps (state) {
  return {
    categories: state.Blog.categories_label_value
  }
}

export default CreateFormHOC(connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateBlog)));
