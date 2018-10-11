import React, { Component } from 'react'
import { Icon, colorifyIcon } from '../Icon'
import iconRole from './iconRole.svg?raw'
import iconManagement from './iconManagement.svg?raw'
import iconColleagues from './iconColleagues.svg?raw'
import iconEnvironment from './iconEnvironment.svg?raw'
import iconBalance from './iconBalance.svg?raw'

export class MoodDriverIcon extends Component {
  shouldComponentUpdate ({ driverType }) {
    return this.props.driverType !== driverType
  }

  render () {
    const { driverType, isMedium, isSmall, isWhite, color } = this.props
    const icon = getDriverIconByType(driverType)
    return (
      <Icon
        isWhite={isWhite}
        isSmall={isSmall}
        isMedium={isMedium}
        html={color ? colorifyIcon(icon, color) : icon}
      />
    )
  }
}

export function getDriverIconByType (driverType) {
  switch (driverType) {
    case 'role': return iconRole
    case 'management': return iconManagement
    case 'colleagues': return iconColleagues
    case 'environment': return iconEnvironment
    case 'balance': return iconBalance
    default: return ''
  }
}
