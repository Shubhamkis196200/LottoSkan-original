import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { checkEmailValidation } from '../../../Helpers/Validation'
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
} from 'reactstrap'
import { connect } from 'react-redux'
import { setAlert, deleteAlert } from '../../../actions/alertAction'
import { forgotPassword } from '../../../actions/authActions'
import Alert from '../../../component/Alert'

class ForgotPassword extends Component {
  constructor() {
    super()
    this.state = {
      email: '',
      errors: {
        error_email: '',
      },
    }
  }

  onInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  onFormSubmit = async (e) => {
    e.preventDefault()
    let { email, errors } = this.state
    let validationFlag = true
    let error
    errors.error_email = ''

    error = checkEmailValidation(email, 1, 50)
    if (error) {
      validationFlag = false
      errors.error_email = error
    }

    if (validationFlag === true) {
      await this.props.forgotPassword({ email })

      this.setState({
        email: '',
        errors: {
          error_email: '',
        },
      })
    } else {
      this.setState({
        errors: errors,
      })
    }
  }

  render() {
    const { isAuthenticated, loading } = this.props.auth
    if (isAuthenticated === true && loading === false) {
      return <Redirect to='/lottery' />
    }

    return (
      <div className='app flex-row align-items-center'>
        <Container>
          <Row className='justify-content-center'>
            <Col md='8'>
              <CardGroup>
                <Card className='p-4'>
                  <CardBody>
                    <Alert />
                    <Form onSubmit={(e) => this.onFormSubmit(e)}>
                      <h1>Forgot Password</h1>
                      <p className='text-muted'>Get a new password</p>
                      <InputGroup className='mb-3'>
                        <InputGroupAddon addonType='prepend'>
                          <InputGroupText>
                            <i className='icon-user'></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type='text'
                          placeholder='Email'
                          autoComplete='Email'
                          name='email'
                          onChange={(e) => this.onInputChange(e)}
                        />
                      </InputGroup>

                      <Row>
                        <Col xs='6'>
                          <Button color='primary btnColor' className='px-4'>
                            Submit
                          </Button>
                        </Col>
                        <Col xs='6' className='text-right'>
                          <Link to='login' color='link' className='px-0'>
                            Login
                          </Link>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card
                  className='text-white bg-primary py-5 d-md-down-none'
                  style={{ width: '44%' }}>
                  <CardBody className='text-center'>
                    <div>
                      <h2>Forgot Password</h2>
                      <p>
                        To reset your password, please enter your Website.com
                        username. Website.com will send the password reset
                        instructions to the email address for this account. If
                        you don't know the username or your email address is no
                        longer valid, please Contact Us for further assistance.
                      </p>
                      {/* <Link to="/register">
                        <Button
                          color="primary"
                          className="mt-3"
                          active
                          tabIndex={-1}
                        >
                          Register Now!
                        </Button>
                      </Link> */}
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
})

export default connect(mapStateToProps, {
  setAlert,
  deleteAlert,
  forgotPassword,
})(ForgotPassword)
