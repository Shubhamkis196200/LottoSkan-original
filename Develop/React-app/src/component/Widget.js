import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody } from 'reactstrap'
import classNames from 'classnames'
import { mapToCssModules } from 'reactstrap/lib/utils'

const propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  description: PropTypes.string,
  color: PropTypes.string,
  value: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  cssModule: PropTypes.object,
  variant: PropTypes.string,
}

const defaultProps = {
  title: '89.9%',
  subTitle: 'Lorem ipsum...',
  // description: 'Lorem ipsum dolor sit amet enim.',
  // value: "25",
  variant: '',
}

class Widget extends Component {
  render() {
    const {
      className,
      cssModule,
      title,
      subTitle,
      description,
      color,
      value,
      children,
      variant,
      ...attributes
    } = this.props

    const progress = { style: '', color: color, value: value }
    const card = { style: '', bgColor: '' }

    if (variant === 'inverse') {
      progress.style = 'progress-white'
      progress.color = ''
      card.style = 'text-white'
      // card.bgColor = "bg-" + color;
      card.bgColor = 'bg-' + color
    }

    const classes = mapToCssModules(
      classNames(className, card.style, card.bgColor),
      cssModule,
    )
    progress.style = classNames('progress-xs my-3', progress.style)

    return (
      <Card className={classes} {...attributes}>
        <CardBody>
          <div className='h4 m-0'>{title}</div>
          <div>{subTitle}</div>
          {/* <Progress
            className={progress.style}
            color={progress.color}
            // value={progress.value}
          /> */}
          <small className='text-muted'>{description}</small>
          <div>{children}</div>
        </CardBody>
      </Card>
    )
  }
}

Widget.propTypes = propTypes
Widget.defaultProps = defaultProps

export default Widget
