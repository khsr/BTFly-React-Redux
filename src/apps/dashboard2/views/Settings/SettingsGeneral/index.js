import React, { Component } from 'react'
import { connect } from '../../../utils/performance'
import { updateCurrentCompany } from '../../../redux/actions/company'
import { IconSettingsWheels } from '../../../components/Icon'
import { FormInput } from '../../../components/FormInput'
import { FormButton } from '../../../components/FormButton'
import { namespace } from '../../../../../utils/locales'
const tn = namespace('dashboard.settings')

const mapStateToProps = ({ currentCompany }) => ({ currentCompany })
const mapDispatchToProps = (dispatch) => {
  return {
    updateCurrentCompany (attrs) { return dispatch(updateCurrentCompany(attrs)) }
  }
}

export class SettingsGeneral extends Component {
  constructor () {
    super()
    this.state = { isDisabled: true, isLoading: false, attrs: {} }
  }

  onSubmit = (e) => {
    e.preventDefault()
    this.setState({ isDisabled: true, isLoading: true })
    this.props.updateCurrentCompany(this.state.attrs).then(() => {
      this.setState({ isLoading: false, attrs: {} })
    })
  }

  createChangeHandler (prop) {
    return ({ isValid, isChanged, value }) => {
      let attrs = { ...this.state.attrs }
      if (isChanged && isValid) {
        attrs[prop] = value
      } else {
        delete attrs[prop]
      }
      this.setState({ attrs, isDisabled: !Object.keys(attrs).length })
    }
  }

  render () {
    const { language, fullName } = this.props.currentCompany
    const { isDisabled, isLoading } = this.state
    return (
      <form onSubmit={this.onSubmit}>
        <FormInput
          isRequired
          type="select"
          label={tn('language')}
          description={tn('language-text')}
          options={[
            { key: 'en', name: 'English' },
            { key: 'fr', name: 'Français' },
            { key: 'hu', name: 'Magyar' }
          ]}
          defaultValue={language}
          onChange={this.createChangeHandler('language')}
        />
        <FormInput
          isRequired
          label={tn('company-name')}
          description={tn('company-name-text')}
          defaultValue={fullName}
          onChange={this.createChangeHandler('name')}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(SettingsGeneral)
