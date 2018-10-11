import React from 'react'
import { uniqueId } from 'lodash'
import './index.css'

export const FormRadio = ({ group, value, isChecked, label, onChange }) => {
  const id = uniqueId('FormRadio')
  return (
    <div className="bf-FormRadio">
      <input type="radio" name={group} value={value} id={id} checked={isChecked} onChange={onChange} />
      <label htmlFor={id}><span />{label}</label>
    </div>
  )
}
