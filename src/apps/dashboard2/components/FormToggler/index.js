import React from 'react'
import './index.css'

export const FormToggler = ({ isCheck, isGrey, isDisabled, onToggle }) => {
  return (
    <button
      type="button"
      className={`bf-FormToggler${isCheck ? ' is-on' : ' is-off'}${isGrey ? ' is-grey' : ''}`}
      onClick={onToggle}
      disabled={isDisabled}
    />
  )
}
