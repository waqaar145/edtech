import React from 'react';
import {FormGroup, Input, Label, FormFeedback, Col} from 'reactstrap';

const InputCheckbox = ({label, handleChange, error, value, disabled, ...restProps}) => {

  return (
    <FormGroup row>
      <Label sm={2}>Active</Label>
      <Col sm={10}>
        <Input 
          onChange={handleChange}
          checked={value ? true : false}
          {...restProps}
          disabled={disabled ? true : false}
        />
        {error && <div style={{color: '#f86c6b', fontSize: '80%', marginTop: '25px'}}>
          {error}
        </div>}
      </Col>
    </FormGroup>
  )
}

export default InputCheckbox;