import React, { Component } from 'react'
import t from '../../../../../utils/locales'
import scorePassword from '../../../../../utils/score-password'
import { FormInput } from '../../../components/FormInput'
import './index.css'

export class ProfileChangePassword extends Component {
  componentWillMount () {
    this.resetState()
  }

  onPassword = ({ value }) => {
    const score = scorePassword(value)
    this.setState({ score, value })
    const isValid = score > 30 && value === this.refs.passwordConfirm.state.value
    this.refs.passwordConfirm.setState({ isValid })
    this.checkChange(value, this.state.confirmValue)
  }

  onPasswordChange = ({ value }) => {
    this.setState({ confirmValue: value })
    this.checkChange(this.state.value, value)
  }

  validatePassword = (value) => {
    return scorePassword(value) > 30
  }

  validatePasswordConfirm = (value) => {
    return this.state.value === value
  }

  checkChange (value, confirmValue) {
    this.props.onChange({ isValid: value && value === confirmValue, isChanged: true, value })
  }

  resetState () {
    this.setState({ score: 0, value: '', confirmValue: '' })
    if (this.refs.password) this.refs.password.setState({ value: '' })
    if (this.refs.passwordConfirm) this.refs.passwordConfirm.setState({ value: '' })
  }

  render () {
    const { score, value, confirmValue } = this.state
    const backgroundColor = score <= 30 ? '#F45D6F' : (score < 60 ? '#FFA76C' : '#34EA7E')
    const width = (score * 1.2 > 100 ? 100 : score * 1.2) + '%'
    return (
      <div className="bf-ProfileChangePassword">
        <FormInput
          ref="password"
          type="password"
          value={value}
          label={t('dashboard.profile.password')}
          validator={this.validatePassword}
          onChange={this.onPassword}
        >
          {score === 0 ? '' : (
            <div className="bf-ProfilePasswordStrength">
              {t('dashboard.profile.strength')}
              <span className="bf-ProfilePasswordStrength-meter">
                <span style={{ backgroundColor, width }} />
              </span>
            </div>
          )}
        </FormInput>
        <FormInput
          ref="passwordConfirm"
          type="password"
          value={confirmValue}
          label={t('dashboard.profile.password-confirm')}
          onChange={this.onPasswordChange}
          validator={this.validatePasswordConfirm}
        />
      </div>
    )
  }
}
