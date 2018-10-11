import React, { PureComponent } from 'react'
import classNames from 'classnames'
import './index.css'
const onChange = () => {} // prevent react warning

export class FormCheck extends PureComponent {
  render () {
    const { isPartial, isSmall, isFull, isChecked, isDisabled, isRadio, onClick, label } = this.props
    const className = classNames('bf-FormCheck', {
      'is-partial': isPartial,
      'is-small': isSmall,
      'is-full': isFull
    })
    return (
      <div className={className} onClick={onClick}>
        <input type={isRadio ? 'radio' : 'checkbox'} checked={isChecked} disabled={isDisabled} onChange={onChange} />
        <label>{label}</label>
      </div>
    )
  }
}

export const FormUnchangableCheck = ({ isChecked }) => {
  return (
    <span className={`bf-FormUnchangableCheck${isChecked ? ' is-checked' : ''}`} />
  )
}
