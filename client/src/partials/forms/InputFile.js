import React from 'react'
import {FormGroup, Input, Label, FormFeedback, Col} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperclip } from '@fortawesome/free-solid-svg-icons'

const InputFile = ({label, handleChange, error, disabled, selectedimage, ...restProps}) => {

  return (
    <FormGroup row>
      <Label sm={2}>
        {label}
      </Label>
      <Col sm={10}>
        <div className="image-upload">
          <label htmlFor="file-input" style={{fontSize: '20px', marginTop: '0px', cursor: !disabled ? 'pointer' : '', color: error ? '#fd397a' : ''}}>
            <FontAwesomeIcon icon={faPaperclip} />
          </label>
          <input 
            style={{display: 'none'}} 
            id="file-input" 
            onChange={handleChange}
            {...restProps}
            disabled={disabled ? true : false}
            />
        </div>
        {error && <div className="customCssInputFieldError" style={{color: '#f86c6b', fontSize: '80%'}}>
          {error}
        </div>}
        <br />
        {selectedimage && <img src={selectedimage} alt="logo" width="50" height="50"/> }
      </Col>
    </FormGroup>
  )
}

export default InputFile;