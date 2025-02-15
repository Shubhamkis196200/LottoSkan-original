import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  checkRequiredValidationWithMinMax,
  checkEmailValidation,
} from '../../../Helpers/Validation'
import {
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
import {
  setAlert,
  deleteAlert,
  deleteAllAlert,
} from '../../../actions/alertAction'
import Alert from '../../../component/Alert'
import { login } from '../../../actions/authActions'
import classnames from 'classnames'
import logo from '../../../assets/logo-2.png'
import LaddaButton, { ZOOM_OUT } from 'react-ladda'
import 'ladda/dist/ladda-themeless.min.css'

class Login extends Component {
  constructor() {
    super()
    this.state = {
      email: '',
      password: '',
      loginLoading: false,
      errors: {
        error_email: '',
        error_password: '',
      },
    }
  }

  componentDidMount() {
    this.props.deleteAllAlert()
  }

  onInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  onSubmitForm = async (e) => {
    e.preventDefault()

    let { email, password, errors } = this.state
    let validationFlag = true
    let error

    error = checkEmailValidation(email, 'Email', 1, 50)
    if (error) {
      validationFlag = false
      errors.error_email = error
    }
    error = checkRequiredValidationWithMinMax(password, 'Password', 1, 25)
    if (error) {
      validationFlag = false
      errors.error_password = error
    }

    if (validationFlag === true) {
      this.setState({
        loginLoading: true,
      })
      await this.props
        .login({ email, password, code: 'adm!njaph7vej' })
        .then((res) => {
          this.setState({
            loginLoading: false,
          })
        })
    } else {
      this.setState({
        errors: errors,
      })
    }
  }

  render() {
    const { email, password, errors, loginLoading } = this.state
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
                <Card className=' p-4'>
                  <CardBody>
                    <Alert />
                    <Form onSubmit={this.onSubmitForm}>
                      <h1>Login</h1>
                      <p className='text-muted'>Sign In to your account</p>
                      <InputGroup className='mb-3'>
                        <InputGroupAddon addonType='prepend'>
                          <InputGroupText>
                            <i className='icon-user'></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type='text'
                          placeholder='Email'
                          name='email'
                          value={email}
                          onChange={(e) => this.onInputChange(e)}
                          className={classnames(
                            { input: true },
                            {
                              'is-invalid': errors.error_email.length > 0,
                            }
                          )}
                        />
                        {errors.error_email ? (
                          <em
                            id='email-error'
                            className='error invalid-feedback'>
                            {errors.error_email}
                          </em>
                        ) : null}
                      </InputGroup>

                      <InputGroup className='mb-4'>
                        <InputGroupAddon addonType='prepend'>
                          <InputGroupText>
                            <i className='icon-lock'></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type='password'
                          placeholder='Password'
                          name='password'
                          value={password}
                          onChange={(e) => this.onInputChange(e)}
                          className={classnames(
                            { input: true },
                            {
                              'is-invalid': errors.error_password.length > 0,
                            }
                          )}
                        />
                        {errors.error_password ? (
                          <em
                            id='email-error'
                            className='error invalid-feedback'>
                            {errors.error_password}
                          </em>
                        ) : null}
                      </InputGroup>
                      <Row>
                        <Col xs='6'>
                          <LaddaButton
                            className='btn btnColor px-4 btn-ladda'
                            loading={loginLoading}
                            data-color='blue'
                            data-style={ZOOM_OUT}>
                            Login
                          </LaddaButton>
                        </Col>

                        {/* <Col xs='6' className='text-right'>
                          <Link
                            to='forgot-password'
                            color='link'
                            className='px-0'>
                            Forgot password?
                          </Link>
                        </Col> */}
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card
                  className='text-white logincard py-5 d-md-down-none'
                  style={{ width: '44%' }}>
                  <CardBody className='text-center d-flex  justify-content-center align-items-center'>
                    <div className='cardtext mt-4 pt-0'>
                      <h2 className='text-dark'>Lotto App Admin</h2>
                      {/* <img
                        src={logo}
                        alt='App Logo'
                        style={{ width: '162px' }}
                      /> */}
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
  login,
  deleteAllAlert,
})(Login)
