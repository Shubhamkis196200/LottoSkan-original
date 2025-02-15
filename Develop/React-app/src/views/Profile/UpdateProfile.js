import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap'
import { deleteAllAlert } from '../../actions/alertAction'
import { loadUser, updateProfile } from '../../actions/authActions'
import classnames from 'classnames'
import {
  checkRequiredValidationWithMinMax,
  checkEmailValidation,
} from '../../Helpers/Validation'
import LaddaButton, { ZOOM_OUT } from 'react-ladda'
import 'ladda/dist/ladda-themeless.min.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import getCroppedImg from '../../component/cropImage'
import Slider from '@material-ui/core/Slider'
import Cropper from 'react-easy-crop'

class UpdateProfile extends Component {
  constructor(props) {
    super(props)
    this.nameRef = React.createRef()
    this.emailRef = React.createRef()

    this.state = {
      // profile_pic: null,
      updateLoading: false,
      profile_pic: '',
      old_profile_pic: '',
      photoPath: '',
      saveLoading: false,
      dataLoader: false,
      pic: { imageSrc: null, croppedAreaPixels: null, isCropping: false },
      crop: { x: 0, y: 0 },
      zoom: 1,
      croppedImage: '',
      cropImageModal: false,
      errors: {
        error_name: '',
        error_email: '',
        error_profile: '',
      },
      error_photo: '',
    }
  }

  componentDidMount() {
    this.props.deleteAllAlert()
    this.props.loadUser()
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    const currentProfilePic = nextProps.auth.admin.profile_pic
    this.setState({
      profile_pic: currentProfilePic,
      old_profile_pic: currentProfilePic,
    })
  }
  // Image Crop Change Start

  onCropChange = (crop) => {
    this.setState({
      crop: crop,
    })
  }

  onCropComplete = (croppedArea, croppedAreaPixels) => {
    this.setState({
      pic: {
        imageSrc: this.state.pic.imageSrc,
        croppedAreaPixels: croppedAreaPixels,
      },
    })
  }

  onZoomChange = (zoom) => {
    this.setState({
      zoom: zoom,
    })
  }

  readFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.addEventListener('load', () => resolve(reader.result), false)
      reader.readAsDataURL(file)
    })
  }

  onFileChange = async (e) => {
    let validateImage = true

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      validateImage = false
      const imageSize = e.target.files[0].size / 1024 / 1024

      if (!file) {
        validateImage = false
        this.setState({
          error_photo: 'Please select image.',
        })
      } else if (!file.name.match(/\.(jpg|jpeg|png|gif)$/)) {
        validateImage = false
        this.setState({
          error_photo: 'Please select valid image.',
        })
      } else if (imageSize > 2) {
        validateImage = false
        this.setState({
          ...this.state,
          error_photo: 'Please select image size less then 2 MB',
        })
      } else {
        validateImage = true

        let imageDataUrl = await this.readFile(file)

        // apply rotation if needed
        this.setState({
          old_profile_pic: imageDataUrl,
          profile_pic: file,
          error_photo: '',
        })
      }
    }
  }

  showCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(
        this.state.pic.imageSrc,
        this.state.pic.croppedAreaPixels
      )
      this.setState({
        setCroppedImage: croppedImage,
        cropImageModal: !this.state.cropImageModal,
      })

      var file = this.dataURLtoFile(croppedImage, 'image.png')

      this.setState({
        profile_pic: file,
        photoPath: file,
      })
    } catch (e) {
      console.error(e)
    }
  }

  dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }

    return new File([u8arr], filename, { type: mime })
  }
  // Image Crop Change End
  onSubmitForm = (e) => {
    e.preventDefault()
    const name = this.nameRef.current.value
    const email = this.emailRef.current.value
    // console.log(name + " => " + email);
    let { profile_pic, errors } = this.state
    let error
    for (var key in errors) {
      if (errors.hasOwnProperty(key)) {
        errors[key] = ''
      }
    }

    let validationFlag = true

    error = checkRequiredValidationWithMinMax(name, 'Name ', 2, 25)
    if (error) {
      validationFlag = false
      errors.error_name = error
    }

    error = checkEmailValidation(email, 'Email', 6, 50)
    if (error) {
      validationFlag = false
      errors.error_email = error
    }
    if (validationFlag === true) {
      this.setState({
        updateLoading: true,
      })

      // console.log("formSubmited");
      let formData = new FormData()
      formData.append('id', this.props.auth.admin._id)
      formData.append('name', name)
      formData.append('email', email)
      if (profile_pic !== '') {
        formData.append('profile_pic', profile_pic)
      }
      this.props
        .updateProfile(formData)
        .then((res) => {
          this.setState({
            updateLoading: false,
          })
          this.props.loadUser()
          toast.success(res.data.message)
        })
        .catch((err) => {
          this.setState({
            updateLoading: false,
          })
          toast.error(err.response.data.message)
        })

      this.setState({
        errors,
      })
    } else {
      this.setState({
        errors,
      })
    }
  }

  render() {
    const containerStyle = {
      zIndex: 1999,
    }
    const { name, email } = this.props.auth.admin
    const { error_name, error_email } = this.state.errors
    const {
      profile_pic,
      old_profile_pic,
      error_photo,
      zoom,
      crop,
      cropImageModal,
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
                <i className='fa fa-user'></i>
                <strong>Update Profile</strong>
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
                        <label>Name</label>
                        <input
                          type='text'
                          name='name'
                          placeholder='Name'
                          defaultValue={name}
                          ref={this.nameRef}
                          className={classnames({
                            'form-control': true,
                            'is-invalid': error_name,
                          })}
                        />
                        {error_name ? (
                          <em
                            id='email-error'
                            className='error invalid-feedback'>
                            {error_name}
                          </em>
                        ) : null}
                      </div>

                      <div className='form-group'>
                        <label>Email</label>
                        <input
                          type='text'
                          name='email'
                          placeholder='Email'
                          value={email}
                          ref={this.emailRef}
                          className={classnames({
                            'form-control': true,
                            readonly: true,
                            'is-invalid': error_email,
                          })}
                          readOnly
                        />
                        {error_email ? (
                          <em
                            id='email-error'
                            className='error invalid-feedback'>
                            {error_email}
                          </em>
                        ) : null}
                      </div>

                      <div className='form-group'>
                        <label>Profile Pic</label>
                        <input
                          type='file'
                          name='profile_pic'
                          defaultValue={profile_pic}
                          placeholder='Enter default number of share'
                          onChange={(e) => this.onFileChange(e)}
                          className='form-control-file '
                        />
                        {error_photo.length > 0 ? (
                          <div className='w-100'>
                            <span className='invalid-text  '>
                              {error_photo}
                            </span>
                          </div>
                        ) : null}
                        {old_profile_pic ? (
                          <img
                            src={old_profile_pic}
                            alt='default-img'
                            className='showProfile'
                          />
                        ) : (
                          <img
                            src={old_profile_pic}
                            alt='default-img'
                            className='showProfile'
                          />
                        )}
                      </div>
                      <LaddaButton
                        className='btn btnColor btn-brand  btn-ladda'
                        loading={this.state.updateLoading}
                        data-color='blue'
                        data-style={ZOOM_OUT}>
                        Update
                      </LaddaButton>
                    </Col>
                  </Row>
                </form>
              </CardBody>
            </Card>
            {/* IMAGE CROP Modal Start*/}
            <Modal isOpen={cropImageModal} setModal={cropImageModal}>
              <ModalHeader
                className='modal-header w-100  text-center'
                toggle={() => {
                  this.setState({
                    cropImageModal: !cropImageModal,
                    pic: {
                      imageSrc: null,
                      croppedAreaPixels: null,
                      isCropping: false,
                    },
                  })
                }}>
                <h4 className=' modal-title m-0 bld_secnd_title'>Crop Image</h4>
              </ModalHeader>
              <ModalBody className='modal-body w-100 float-left text-center pt-5 pb-5'>
                <div className='app-image'>
                  <div className='crop-container'>
                    <Cropper
                      image={this.state.pic.imageSrc}
                      crop={crop}
                      zoom={zoom}
                      aspect={1 / 1}
                      onCropChange={this.onCropChange}
                      onCropComplete={this.onCropComplete}
                      onZoomChange={this.onZoomChange}
                    />
                  </div>
                  <div className='controls w-100'>
                    <Slider
                      value={zoom}
                      min={1}
                      max={3}
                      step={0.1}
                      aria-labelledby='Zoom'
                      onChange={(e, zoom) => this.onZoomChange(zoom)}
                      classes={{ container: 'slider' }}
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter
                className='modal-footer w-100 text-center '
                style={{ display: 'unset' }}>
                <button
                  type='button'
                  className='btn btnColor text-center btn_modal px-5'
                  onClick={this.showCroppedImage}>
                  Crop
                </button>
              </ModalFooter>
            </Modal>
            {/* IMAGE CROP Modal End*/}
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
  deleteAllAlert,
  loadUser,
  updateProfile,
})(UpdateProfile)
