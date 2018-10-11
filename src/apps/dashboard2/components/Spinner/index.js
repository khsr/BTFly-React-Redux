import React from 'react'
import './index.css'

export const Spinner = ({ isCenter }) => {
  return (
    <div className={`bf-Spinner${isCenter ? ' is-center' : ''}`}>
      <span />
    </div>
  )
}
