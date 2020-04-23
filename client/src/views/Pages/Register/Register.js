import React, { useState } from 'react';
import { Button, Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, FormGroup, Label, FormFeedback } from 'reactstrap';
import {connect} from 'react-redux';
import { validateFinally, stringValidation, emailValidation } from './../../../helpers/validation';
import {signupAction} from './../../../stores/actions/authActions';
import './../../../assets/css/error.css'
import { useHistory } from "react-router-dom";
import PropTypes from 'prop-types'
import ServerErrors from './../../../components/messages/serverError'

const Register = (props) => {
    let userState = {
      name: '',
      email: '',
      password: ''
    }
    const history = useHistory();
    const [values, setValue] = useState(userState)
    const [errors, setErrors] = useState(userState)
    const [serverErrors, setServerError] = useState([])

    const handleChange = (e) => {
      let error;
      const {name, value} = e.target;
      switch (name) {
        case 'name':
          error = stringValidation(value, name, 3, 35);
          setErrors({...errors, [name]: error === true ? '' : error})
          break;

        case 'email':
          error = emailValidation(value, name);
          setErrors({...errors, [name]: error === true ? '' : error})
          break;

        case 'password':
          error = stringValidation(value, name, 6, 20);
            setErrors({...errors, [name]: error === true ? '' : error})
          break;

        default:

      }
      setValue({...values, [name]: value})
    }

    function handleSubmit (e) {
      e.preventDefault()
      if (validateFinally(errors, values) === true) {
        props.signupAction(values)
          .then(
            response => {
              console.log(response)
            }
          ).catch(
            error => {
              if (error.response.status === 422) {
                setServerError([...error.response.data.data])
              }
            }
          )
      } else {
        console.log(validateFinally(errors, values))
      }
    }

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <center><h4>Signup</h4></center>
                  <br />
                  <Form onSubmit={handleSubmit}>
                    <FormGroup>
                      <Input type="text" name="name" placeholder="Name" value={values.name} onChange={handleChange} invalid={errors.name !== ''}/>
                      {errors.name && <FormFeedback>{errors.name}</FormFeedback>}
                    </FormGroup>
                    <FormGroup>
                      <Input type="text" name="email" placeholder="Email" value={values.email} onChange={handleChange} invalid={errors.email !== ''}/>
                      {errors.email && <FormFeedback className="error">{errors.email}</FormFeedback>}
                    </FormGroup>
                    <FormGroup>
                      <Input type="password" name="password" placeholder="Password" value={values.password} onChange={handleChange} invalid={errors.password !== ''}/>
                      {errors.password && <FormFeedback className="error">{errors.password}</FormFeedback>}
                    </FormGroup>
                    <Button color="primary" size="sm" type="submit">Submit</Button>
                  </Form>
                  <br />
                  {
                    serverErrors.length > 0 && <ServerErrors errors={serverErrors} />
                  }
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
}

Register.propTypes = {
  signupAction: PropTypes.func
}


const mapDispatchToProps = {signupAction}

export default connect(null, mapDispatchToProps)(Register);
