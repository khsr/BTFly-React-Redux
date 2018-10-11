import React from 'react'
import classNames from 'classnames'
import { Link } from 'react-router'
import './index.css'

export const HeaderMenu = ({ items }) => {
  return (
    <div className="bf-HeaderMenu">
      {items.map(({ to, onlyActiveOnIndex, icon, isActive, title, titleCounter, notificationCounter }, index) => {
        const className = classNames('bf-HeaderMenu-item', { 'is-active': isActive })
        const activeClassName = isActive === undefined ? 'is-active' : ''
        return (
          <Link key={index} className={className} activeClassName={activeClassName} to={to} onlyActiveOnIndex={onlyActiveOnIndex} >
            {icon}
            <span className="bf-HeaderMenu-item-title">{title}</span>
            {titleCounter ? (
              <span className="bf-HeaderMenu-item-counter">{titleCounter}</span>
            ) : null}
            {notificationCounter ? (
              <span className="bf-HeaderMenu-item-notification">{notificationCounter}</span>
            ) : null}
          </Link>
        )
      })}
    </div>
  )
}
