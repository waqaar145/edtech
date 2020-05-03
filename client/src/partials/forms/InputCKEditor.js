import React from 'react';
import Select from 'react-select';
import {FormGroup, Label, Col } from 'reactstrap';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const InputCKEditor = ({id, label, handleChange, error, value, ckeditorHeightClass}) => {

  return (
    <FormGroup row>
      <Label sm={2}>
        {label}
      </Label>
      <Col sm={10} className={ckeditorHeightClass}>
        <CKEditor
          id={id}
          editor={ ClassicEditor }
          data={value}
          onInit={editor => {
            editor.setData(value)
          }}
          onChange={(event, editor) => {
            handleChange(editor)
          }}
        />
        {error && <div style={{color: '#f86c6b', fontSize: '80%'}}>
          {error}
        </div>}
      </Col>
    </FormGroup>
  )
}

export default InputCKEditor;