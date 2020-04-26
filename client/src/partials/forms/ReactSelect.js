import React from 'react';
import Select from 'react-select';
import {FormGroup, Label, Col } from 'reactstrap';

const ReactSelect = ({label, handleChange, error, value, options}) => {

  return (
    <FormGroup row>
      <Label sm={2}>
        {label}
      </Label>
      <Col sm={10}>
        <Select
          value={value}
          onChange={handleChange}
          options={options}
        />
        {error && <div style={{color: '#f86c6b', fontSize: '80%'}}>
          {error}
        </div>}
      </Col>
    </FormGroup>
  )
}

export default ReactSelect;