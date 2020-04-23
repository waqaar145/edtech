import React from 'react';
import { Alert } from 'reactstrap';

const ServerErrors = ({errors}) => {

  return (
    <div>
      {
        errors.map((error, index) => {
          return (
            <Alert color="danger" key={index}>
              {error.msg}
            </Alert>
          )
        })
      }
    </div>
  )
}

export default ServerErrors;
