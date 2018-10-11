import React from 'react'
import { Spinner } from '../Spinner'
import { Icon } from '../Icon'
import iconNext from './iconNext.svg?react'
import './index.css'

export const FormButton = ({ text, icon, isDisabled, isLoading, isButton, isLarge, isWarning, onClick }) => {
  if (icon === 'next') icon = <Icon icon={iconNext} />
  return (
    <button
      type={isButton ? 'button' : 'submit'}
      className={`bf-FormButton${isLarge ? ' is-large' : ''}${isWarning ? ' is-warning' : ''}${!icon ? ' is-noIcon' : ''}`}
      disabled={isDisabled || isLoading || false}
      onClick={onClick}
    >
      {text}
      {isLoading ? <Spinner isCenter={!icon} /> : icon || null}
    </button>
  )
}
