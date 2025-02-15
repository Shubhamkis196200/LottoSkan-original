import React, { Component } from 'react'
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  UncontrolledDropdown,
} from 'reactstrap'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { logout } from '../../actions/authActions'
import { Link } from 'react-router-dom'
import {
  // AppAsideToggler,
  AppNavbarBrand,
  AppSidebarToggler,
} from '@coreui/react'

// import logo from '../../assets/logo.png'
import logo from '../../assets/img/logo.png'
// import logo from "../../assets/img/brand/logo.svg";
import minLogo from '../../assets/img/logo.png'
// import avatar from "../../assets/img/avatars/6.jpg";

const propTypes = {
  children: PropTypes.node,
}

const defaultProps = {}

class DefaultHeader extends Component {
  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props
    const { admin } = this.props.auth

    // console.log(admin);
    return (
      <React.Fragment>
        <AppSidebarToggler className='d-lg-none' display='md' mobile />
        <AppNavbarBrand
          full={{ src: logo, width: 48, height: 48, alt: 'CoreUI Logo' }}
          minimized={{
            src: minLogo,
            width: 30,
            height: 30,
            alt: 'CoreUI Logo',
          }}>
          {/* Lotto APP */}
        </AppNavbarBrand>
        <AppSidebarToggler className='d-md-down-none' display='lg' />
        <Nav className='ml-auto mr-2' navbar>
          <UncontrolledDropdown nav direction='down'>
            <DropdownToggle nav>
              {admin !== null && (
                <>
                  <img src={admin.profile_pic} className='img-avatar' alt='' />

                  <span className='drop-down-arrow'>
                    <i className='fa fa-caret-down '></i>
                  </span>
                </>
              )}
            </DropdownToggle>
            <DropdownMenu right style={{ height: 'auto', right: 0 }}>
              <Link to='/update-profile' className='dropDownItem'>
                <DropdownItem>
                  <i className='fa fa-user'></i> Update Profile
                </DropdownItem>
              </Link>

              <Link to='/change-password' className='dropDownItem'>
                <DropdownItem>
                  <i className='fa fa-key'></i> Change Password
                </DropdownItem>
              </Link>

              <DropdownItem onClick={this.props.logout}>
                <i className='fa fa-lock'></i> Logout
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
        {/* <AppAsideToggler className="d-md-down-none" /> */}
      </React.Fragment>
    )
  }
}

DefaultHeader.propTypes = propTypes
DefaultHeader.defaultProps = defaultProps

const mapStateToProps = (state) => ({
  auth: state.auth,
})

export default connect(mapStateToProps, { logout })(DefaultHeader)
