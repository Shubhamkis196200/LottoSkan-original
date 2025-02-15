import React, { Component } from "react";
import PropTypes from "prop-types";

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultFooter extends Component {
  render() {
    // console.log(`${process.env.REACT_APP_NAME}`);
    // console.log(process.env.APP_NAME);
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;
    const AppName = process.env.REACT_APP_NAME;
    return (
      <React.Fragment>
        <span>All rights reserved by {AppName}.</span>
      </React.Fragment>
    );
  }
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;
