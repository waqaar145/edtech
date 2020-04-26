import React from 'react'
import {FormGroup, Input, Label, FormFeedback, Col } from 'reactstrap';

const InputText = ({label, handleChange, error, disabled, value, ...restProps}) => {

  return (
    <FormGroup row>
      <Label sm={2}>
        {label}
      </Label>
      <Col sm={10}>
        <Input
          onChange={handleChange}
          value={!value ? '' : value}
          {...restProps}
          invalid={!!error}
          disabled={disabled ? true : false}
          />
        {error && <FormFeedback type="invalid">
          {error}
        </FormFeedback>}
      </Col>
    </FormGroup>
  )
}
export default InputText;