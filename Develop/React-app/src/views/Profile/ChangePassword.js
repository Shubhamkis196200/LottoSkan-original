import React, { Component } from 'react'
import { checkRequiredValidationWithMinMax } from '../../Helpers/Validation'
import { Row, Col, Card, CardHeader, CardBody } from 'reactstrap'
import classnames from 'classnames'
import { changePassword, loadUser } from '../../actions/authActions'
import { deleteAllAlert } from '../../actions/alertAction'
import { connect } from 'react-redux'
import LaddaButton, { ZOOM_OUT } from 'react-ladda'
import 'ladda/dist/ladda-themeless.min.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

class ChangePassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      old_password: '',
      new_password: '',
      confirm_password: '',
      updateLoading: false,
      errors: {
        error_old_password: '',
        error_new_password: '',
        error_confirm_password: '',
      },
    }
  }

  componentDidMount() {
    this.props.deleteAllAlert()
    this.props.loadUser()
  }

  onFieldChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  onSubmitForm = (e) => {
    e.preventDefault()
    let { old_password, new_password, confirm_password, errors } = this.state
    let validationFlag = true
    let error
    for (var key in errors) {
      if (errors.hasOwnProperty(key)) {
        errors[key] = ''
      }
    }

    error = checkRequiredValidationWithMinMax(
      old_password,
      'Old passsword',
      6,
      25
    )
    if (error) {
      validationFlag = false
      errors.error_old_password = error
    }

    error = checkRequiredValidationWithMinMax(
      new_password,
      'New password',
      1,
      25
    )
    if (error) {
      validationFlag = false
      errors.error_new_password = error
    }

    error = checkRequiredValidationWithMinMax(
      confirm_password,
      'Confirm password',
      1,
      25
    )
    if (error) {
      validationFlag = false
      errors.error_confirm_password = error
    }
    if (validationFlag === true) {
      if (new_password !== confirm_password) {
        validationFlag = false
        errors.error_confirm_password =
          'Confirm password should be same as new password'
      }
    }

    if (validationFlag === true) {
      this.setState({ updateLoading: true })
      const id = this.props.auth.admin._id
      this.props
        .changePassword({
          old_password,
          new_password,
          confirm_password,
          id,
        })
        .then((res) => {
          this.setState({ updateLoading: false })
          toast.success(res.data.message)
        })
        .catch((err) => {
          this.setState({ updateLoading: false })
          toast.error(err.response.data.message)
        })

      this.setState({
        old_password: '',
        new_password: '',
        confirm_password: '',
        errors: {
          error_old_password: '',
          error_new_password: '',
          error_confirm_password: '',
        },
      })
    } else {
      this.setState(
        {
          errors,
        },
        function () {
          console.log(this.state)
        }
      )
    }
  }

  render() {
    const containerStyle = {
      zIndex: 1999,
    }
    const {
      old_password,
      new_password,
      confirm_password,
      errors,
      updateLoading,
    } = this.state

    return (
      <div className='animated fadeIn'>
        <ToastContainer
          position='top-right'
          autoClose={5000}
          style={containerStyle}
        />
        <Row>
          <Col xs='12'>
            <Card>
              <CardHeader>
                <i class='fas fa-key'></i>
                <strong>Change Password</strong>
                <div className='card-header-actions'>
                  {/* <a
                    href="https://reactstrap.github.io/components/breadcrumbs/"
                    rel="noreferrer noopener"
                    target="_blank"
                    className="card-header-action"
                  > */}
                  {/* <small className="text-muted">docs</small> */}
                  {/* </a> */}
                </div>
              </CardHeader>
              <CardBody>
                <form onSubmit={(e) => this.onSubmitForm(e)}>
                  <Row>
                    <Col xs='12'>
                      <div className='form-group'>
                        <label>Old Password</label>
                        <input
                          type='password'
                          name='old_password'
                          placeholder='Old Password'
                          value={old_password}
                          onChange={(e) => this.onFieldChange(e)}
                          className={classnames(
                            { 'form-control': true },
                            {
                              'is-invalid':
                                errors.error_old_password.length > 0,
                            }
                          )}
                        />
                        {errors.error_old_password.length > 0 ? (
                          <em
                            id='email-error'
                            className='error invalid-feedback'>
                            {errors.error_old_password}
                          </em>
                        ) : null}
                      </div>

                      <div className='form-group'>
                        <label>New Password</label>
                        <input
                          type='password'
                          name='new_password'
                          className={classnames(
                            { 'form-control': true },
                            {
                              'is-invalid':
                                errors.error_new_password.length > 0,
                            }
                          )}
                          placeholder='New Password'
                          value={new_password}
                          onChange={(e) => this.onFieldChange(e)}
                        />
                        {errors.error_new_password ? (
                          <em
                            id='email-error'
                            className='error invalid-feedback'>
                            {errors.error_new_password}
                          </em>
                        ) : null}
                      </div>

                      <div className='form-group'>
                        <label>Confirm Password</label>
                        <input
                          type='password'
                          name='confirm_password'
                          className={classnames(
                            { 'form-control': true },
                            {
                              'is-invalid':
                                errors.error_confirm_password.length > 0,
                            }
                          )}
                          placeholder='Confirm Password'
                          value={confirm_password}
                          onChange={(e) => this.onFieldChange(e)}
                        />
                        {errors.error_confirm_password ? (
                          <em
                            id='email-error'
                            className='error invalid-feedback'>
                            {errors.error_confirm_password}
                          </em>
                        ) : null}
                      </div>
                      <LaddaButton
                        className='btn btnColor btn-brand  btn-ladda'
                        loading={updateLoading}
                        data-color='blue'
                        data-style={ZOOM_OUT}>
                        Update
                      </LaddaButton>
                    </Col>
                  </Row>
                </form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
})

export default connect(mapStateToProps, {
  changePassword,
  deleteAllAlert,
  loadUser,
})(ChangePassword)
