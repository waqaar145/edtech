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

const ReactSelectWithoutLabel = ({label, handleChange, error, value, options}) => {

  return (
    <Col sm={6}>
      <span className="lable-heading">{label}</span>
      <Select
        value={value}
        onChange={handleChange}
        options={options}
        styles={error ? customStyles : ''}
      />
      {error && <div style={{color: '#f86c6b', fontSize: '80%'}}>
        {error}
      </div>}
    </Col>
  )
}

export default ReactSelectWithoutLabel;