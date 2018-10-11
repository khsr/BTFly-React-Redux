import React from 'react'
import classNames from 'classnames'
import './index.css'

export const Logo = ({ isSmall, isLarge }) => {
  const className = classNames('bf-Logo', {
    'is-small': isSmall,
    'is-large': isLarge
  })
  return <div className={className} />
}

export const LogoWithText = ({ isSmall, isLarge }) => {
  const className = classNames('bf-LogoWithText', {
    'is-small': isSmall,
    'is-large': isLarge
  })
  return <div className={className} />
}
