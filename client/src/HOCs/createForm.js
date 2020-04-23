import React, {useState, useEffect} from 'react';
import {Row, Col} from 'reactstrap'

const CreateFormHOC = (OriginalComponent) => {
  const WrappedComponent = () => {

    const [heading, setHeading] = useState('')
    const onSetHeading = (data) => {
      setHeading(data)
    }

    return (
      <div>
        <Row className="create-form-heading-row">
          <Col xs={3} className="create-form-heading">
            <h3>{heading}</h3>
          </Col>
        </Row>
        <Row className="create-form-body-row">
          <OriginalComponent onSetHeading={onSetHeading}/>
        </Row>
      </div>
    )
  }

  return WrappedComponent;
}

export default CreateFormHOC;
