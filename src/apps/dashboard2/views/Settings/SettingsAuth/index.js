import React, { Component } from 'react'
import { connect } from '../../../utils/performance'
import urlRegex from 'url-regex'
import { updateCurrentCompany } from '../../../redux/actions/company'
import { FormInput } from '../../../components/FormInput'
import { FormButton } from '../../../components/FormButton'
import { IconSettingsWheels } from '../../../components/Icon'
import { namespace } from '../../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.settings')

const mapStateToProps = ({ currentCompany }) => ({ currentCompany })
const mapDispatchToProps = (dispatch) => {
  return {
    updateAuthSettings (auth) { return dispatch(updateCurrentCompany({ auth })) }
  }
}

export class SettingsAuth extends Component {
  constructor (props) {
    super(props)
    this.state = { isDisabled: true, isLoading: false, auth: props.currentCompany.auth }
  }

  onSubmit = (e) => {
    e.preventDefault()
    this.setState({ isDisabled: true, isLoading: true })
    this.props.updateAuthSettings(this.state.auth).then(() => {
      this.setState({ isLoading: false })
    })
  }

  createAuthChangeHandler (prop) {
    return ({ isValid, isChanged, value }) => {
      let auth = { ...this.state.auth }
      if (isChanged && isValid) {
        auth[prop] = value
      } else {
        delete auth[prop]
      }
      this.setState({ auth, isDisabled: Object.keys(auth).length < 3 })
    }
  }

  isUrl (value) {
    return urlRegex({ isExact: true }).test(value)
  }

  getRawCert (e) {
    return e.target.value
    .replace('-----BEGIN CERTIFICATE-----', '')
    .replace('-----END CERTIFICATE-----', '')
    .trim()
    .replace(/\n/g, '')
  }

  render () {
    const { isDisabled, isLoading, auth } = this.state
    return (
      <form onSubmit={this.onSubmit}>
        <div className="bf-SettingsAuthGroup">
          <div className="bf-SettingsAuthGroup-title">{tn('auth-url')}</div>
          <div className="bf-SettingsAuthGroup-subTitle">{tn('auth-url-details')}</div>
          <FormInput
            isFullWidth
            isRequired
            validator={this.isUrl}
            defaultValue={auth.entryPoint}
            onChange={this.createAuthChangeHandler('entryPoint')}
          />
        </div>
        <div className="bf-SettingsAuthGroup">
          <div className="bf-SettingsAuthGroup-title">{tn('auth-issuer')}</div>
          <div className="bf-SettingsAuthGroup-subTitle">{tn('auth-issuer-details')}</div>
          <FormInput
            isFullWidth
            isRequired
            validator={this.isUrl}
            defaultValue={auth.issuer}
            onChange={this.createAuthChangeHandler('issuer')}
          />
        </div>
        <div className="bf-SettingsAuthGroup">
          <div className="bf-SettingsAuthGroup-title">{tn('auth-cert')}</div>
          <div className="bf-SettingsAuthGroup-subTitle">{tn('auth-cert-details')}</div>
          <FormInput
            isFullWidth
            isRequired
            type="textarea"
            getValue={this.getRawCert}
            defaultValue={auth.cert}
            onChange={this.createAuthChangeHandler('cert')}
          />
        </div>
        <FormButton
          text={tn('send')}
          icon={<IconSettingsWheels />}
          isDisabled={isDisabled}
          isLoading={isLoading}
          onClick={this.onSubmit}
        />
      </form>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsAuth)
