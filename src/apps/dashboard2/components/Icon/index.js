import React, { PureComponent } from 'react'
import classNames from 'classnames'
import iconReport from './iconReport.svg?react'
import iconComments from './iconComments.svg?react'
import iconFocus from './iconFocus.svg?react'
import iconExport from './iconExport.svg?react'
import iconResend from './iconResend.svg?react'
import iconDuplicate from './iconDuplicate.svg?react'
import iconDisable from './iconDisable.svg?react'
import iconDelete from './iconDelete.svg?react'
import iconSettings from './iconSettings.svg?react'
import iconSettingsWheels from './iconSettingsWheels.svg?react'
import iconTeams from './iconTeams.svg?react'
import iconTags from './iconTags.svg?react'
import iconTagUsers from './iconTagUsers.svg?react'
import iconAdd from './iconAdd.svg?react'
import iconImport from './iconImport.svg?react'
import iconCancel from './iconCancel.svg?react'
import iconUser from './iconUser.svg?react'
import iconAuth from './iconAuth.svg?react'
import iconCamera from './iconCamera.svg?react'
import iconUp from './iconUp.svg?react'
import iconIntegrations from './iconIntegrations.svg?react'
import iconShare from './iconShare.svg?react'
import iconBoxChecked from './iconBoxChecked.svg?react'
import iconCircleChecked from './iconCircleChecked.svg?react'
import './index.css'

export class Icon extends PureComponent {
  render () {
    const { isSmall, isMedium, isWhite, icon, html, onClick } = this.props
    const className = classNames('bf-Icon', this.props.className, {
      'is-small': isSmall,
      'is-medium': isMedium,
      'is-white': isWhite
    })
    return typeof html === 'string'
    ? <i className={className} onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />
    : <i className={className} onClick={onClick}>{React.createElement(icon)}</i>
  }
}

export function createIcon (SVG) {
  return function SVGIcon (props) {
    return <Icon {...props} icon={SVG} />
  }
}

export function getColorFromSVGIcon (svg) {
  return svg.match(/fill="(#[0-9A-F]*)"/)[1]
}

export function colorifyIcon (icon, color, rexepColor = '#\\w{6}') {
  return icon.replace(new RegExp(`fill="${rexepColor}"`), `fill="${color}"`)
}

export const IconReport = createIcon(iconReport)
export const IconComments = createIcon(iconComments)
export const IconFocus = createIcon(iconFocus)
export const IconExport = createIcon(iconExport)
export const IconResend = createIcon(iconResend)
export const IconDuplicate = createIcon(iconDuplicate)
export const IconDisable = createIcon(iconDisable)
export const IconDelete = createIcon(iconDelete)
export const IconSettings = createIcon(iconSettings)
export const IconSettingsWheels = createIcon(iconSettingsWheels)
export const IconTeams = createIcon(iconTeams)
export const IconTags = createIcon(iconTags)
export const IconTagUsers = createIcon(iconTagUsers)
export const IconAdd = createIcon(iconAdd)
export const IconImport = createIcon(iconImport)
export const IconCancel = createIcon(iconCancel)
export const IconUser = createIcon(iconUser)
export const IconAuth = createIcon(iconAuth)
export const IconCamera = createIcon(iconCamera)
export const IconUp = createIcon(iconUp)
export const IconIntegrations = createIcon(iconIntegrations)
export const IconShare = createIcon(iconShare)
export const IconBoxChecked = createIcon(iconBoxChecked)
export const IconCircleChecked = createIcon(iconCircleChecked)
