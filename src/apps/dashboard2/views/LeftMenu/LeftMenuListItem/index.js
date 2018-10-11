import React, { PureComponent } from 'react'
import { Link } from 'react-router'
import { Icon } from '../../../components/Icon'
import './index.css'

export class LeftMenuListItem extends PureComponent {
  render () {
    const { onClick, to, href, text, icon, counter, isHide } = this.props
    if (isHide) return null
    return (
      <li>
        {to ? (
          <Link to={to} activeClassName="is-active" onClick={onClick}>
            {typeof icon === 'string' ? <Icon icon={icon} /> : icon}
            {text}
            {counter ? <span>{counter}</span> : null}
          </Link>
        ) : (
          <a href={href} onClick={onClick}>
            {icon} {text}
          </a>
        )}
      </li>
    )
  }
}
