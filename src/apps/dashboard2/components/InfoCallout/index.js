import React, { Component } from 'react'
import classNames from 'classnames'
import Tooltip from 'rc-tooltip'
import { Icon } from '../Icon'
import iconInfo from './iconInfo.svg?react'
import './index.css'

export class InfoCallout extends Component {
  shouldComponentUpdate ({ text }) {
    return this.props.text !== text
  }

  render () {
    const { isWhite, isGrey, placement, mouseEnterDelay, text, children } = this.props
    const className = classNames('bf-InfoCallout', {
      'is-white': isWhite,
      'is-grey': isGrey
    })

    return (
      <Tooltip
        mouseEnterDelay={mouseEnterDelay}
        placement={placement || 'top'}
        prefixCls="bf-InfoCalloutTooltip"
        trigger={['hover']}
        animation="zoom"
        overlay={text}
      >
        {children || <div className={className}><Icon icon={iconInfo} /></div>}
      </Tooltip>
    )
  }
}
