import React from 'react'
import { Icon } from '../../../../components/Icon'
import iconCreateUser from './iconCreateUser.svg?react'
import './index.css'

export const TeamHeaderCreateUser = ({ onCreateUsers }) => {
  return (
    <button
      type="button"
      className="bf-TeamHeaderCreateUser"
      onClick={onCreateUsers}
    >
      <Icon icon={iconCreateUser} />
    </button>
  )
}
