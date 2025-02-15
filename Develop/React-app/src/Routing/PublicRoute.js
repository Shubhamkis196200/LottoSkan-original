import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const PublicRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated === true && loading === false ? (
        <Redirect to='/lottery' />
      ) : (
        <Component {...props} />
      )
    }
  />
)

PublicRoute.propTypes = {
  auth: PropTypes.object.isRequired,
}
const mapSateToProps = (state) => ({
  auth: state.auth,
})
export default connect(mapSateToProps)(PublicRoute)
