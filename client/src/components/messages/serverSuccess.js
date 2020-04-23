import React from 'react';
import { Alert } from 'reactstrap';

const ServerSuccess = ({message}) => {

  return (
    <div>
      <Alert color="success">
        {message}
      </Alert>
    </div>
  )
}

export default ServerSuccess;
