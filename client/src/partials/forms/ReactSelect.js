import React from 'react';
import Select from 'react-select';
import {FormGroup, Label, Col } from 'reactstrap';

const customStyles = {
  control: (provided, state) =>
    true
    ? {
        ...provided,
        boxShadow: "0 0 0 1px red !important",
        borderColor: "red !important"
      }
    : provided
}

const ReactSelect = ({label, handleChange, error, value, options, isMulti}) => {

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
          isMulti={isMulti ? true: false}
          styles={error ? customStyles : ''}
        />
        {error && <div style={{color: '#f86c6b', fontSize: '80%'}}>
          {error}
        </div>}
      </Col>
    </FormGroup>
  )
}

export default ReactSelect;