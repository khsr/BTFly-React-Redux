import React from 'react'
import classNames from 'classnames'
import './index.css'

export const CloseButton = ({ isGreen, isWithoutBox, isLarge, onClose }) => {
  const className = classNames('bf-CloseButton', {
    'is-green': isGreen,
    'is-large': isLarge,
    'is-withoutBox': isWithoutBox
  })
  return (
    <button
      className={className}
      type="button"
      onClick={onClose}
    />
  )
}
