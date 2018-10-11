import React, { Component } from 'react'
import { uniqueId } from 'lodash'
import isEmail from 'regex-email'
import { namespace } from '../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.profile')

export class FormInput extends Component {
  constructor (props) {
    super(props)
    this.id = uniqueId('FormInput')
    this.state = { isValid: true, isChanged: false, value: this.getDefaultValue() }
  }

  onChange = (e) => {
    const value = this.getValue(e)
    const { isRequired, regexp, validator } = this.props
    const setState = (isValid) => {
      this.setState({ isValid, value })
      if (this.props.onChange) {
        this.props.onChange({ isValid, value, isChanged: value !== this.getDefaultValue() })
      }
    }
    if (value === this.getDefaultValue()) {
      return setState(true)
    } else if (!value) {
      return setState(!isRequired)
    } else if (regexp && !regexp.test(value)) {
      return setState(false)
    } if (validator) {
      return setState(validator(value))
    }
    setState(true)
  }

  getValue (e) {
    return typeof this.props.getValue === 'function'
      ? this.props.getValue(e)
      : e.target.value.trim()
  }

  getDefaultValue () {
    return typeof this.props.value === 'undefined'
      ? this.props.defaultValue
      : ''
  }

  render () {
    const { label, description, type, placeholder, value, defaultValue, isRequired,
      options, children, isFullWidth, isDisabled } = this.props
    const { isValid } = this.state
    const validClassName = this.state.value === this.getDefaultValue() ? '' : (isValid ? 'is-valid' : 'is-invalid')
    const defaultProps = {
      className: validClassName,
      id: this.id,
      onChange: this.onChange,
      required: isRequired || false,
      disabled: isDisabled || false,
      value,
      defaultValue,
      placeholder
    }
    const input = type === 'select' ? (
      <select {...defaultProps}>
        {options.map((o, index) => {
          return <option key={index} disabled={o.isDisabled} value={o.key}>{o.name}</option>
        })}
      </select>
    ) : (type === 'textarea') ? (
      <textarea {...defaultProps} />
    ) : (
      <input type={type || 'text'} {...defaultProps} />
    )
    const desc = !description ? '' : (
      <div className="bf-FormInput-description">
        {description}
      </div>
    )
    const htmlLabel = !label ? '' : (
      <label htmlFor={this.id}>{label}:</label>
    )
    return (
      <div className="bf-FormInput" style={isFullWidth ? { maxWidth: 'initial' } : {}}>
        {children}
        {htmlLabel}
        <span className={validClassName} />
        {input}
        {desc}
      </div>
    )
  }
}

export const FormInputEmail = (props) => {
  const { defaultValue, existingEmails } = props
  const getValue = (e) => e.target.value.trim().toLowerCase()
  const validator = (value) => defaultValue === value || !existingEmails.includes(value)
  return (
    <FormInput
      type="email"
      label={tn('email')}
      placeholder={tn('email-example')}
      regexp={isEmail}
      getValue={getValue}
      validator={validator}
      {...props}
    />
  )
}

export const FormInputFullName = (props) => {
  return (
    <FormInput
      label={tn('full-name')}
      placeholder={tn('full-name-example')}
      regexp={/(.){1} (.){1}/}
      {...props}
    />
  )
}

export const FormInputSlack = (props) => {
  const { defaultValue, existingSlacks } = props
  const isMention = /^@[a-zA-Z0-9/_\-]+$/
  const getValue = (e) => e.target.value.trim().toLowerCase()
  const validator = (value) => defaultValue === value || !existingSlacks.includes(value)
  return (
    <FormInput
      label={tn('slack')}
      placeholder={tn('slack-example')}
      regexp={isMention}
      getValue={getValue}
      validator={validator}
      {...props}
    />
  )
}
