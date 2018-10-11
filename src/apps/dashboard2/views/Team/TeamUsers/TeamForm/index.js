import React, { Component } from 'react'
import { union, difference, intersection } from 'lodash'
import classNames from 'classnames'
import { Modal } from '../../../../components/Modal'
import { Icon } from '../../../../components/Icon'
import { FormInputEmail, FormInputFullName, FormInputSlack } from '../../../../components/FormInput'
import { FormRadio } from '../../../../components/FormRadio'
import { FormButton } from '../../../../components/FormButton'
import { TeamTagsSelector } from '../TeamTagsSelector'
import iconUser from './iconUser.svg?react'
import { namespace } from '../../../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.teams')

const IconUser = <Icon icon={iconUser} />

export class TeamForm extends Component {
  constructor (props) {
    super(props)

    const { isEdit, user } = props
    this.state = {
      isDisabled: true,
      currentEmail: isEdit ? user.email : '',
      currentSlack: isEdit ? user.slack : '',
      role: isEdit ? user.role : 'user',
      values: {
        fullName: { value: isEdit ? user.fullName : '', isChanged: false, isValid: isEdit || false },
        email: { value: isEdit ? user.email : '', isChanged: false, isValid: isEdit || false },
        slack: { value: isEdit ? user.slack : '', isChanged: false, isValid: isEdit || false },
        preferred: { value: isEdit ? user.preferred : 'email', isChanged: false, isValid: true },
        role: { value: isEdit ? user.role : 'user', isChanged: false, isValid: true },
        groupIds: { value: isEdit ? user.groupIds : '', isChanged: false, isValid: true },
        hasAccessOnly: {
          value: isEdit ? user.hasAccessOnly : [],
          isChanged: false,
          isValid: isEdit && user.hasAccessOnly.length || false
        }
      }
    }
  }

  onSaveForm = (e, addAnother = false) => {
    const { isDisabled, values } = this.state
    if (isDisabled) return
    const { fullName, email, slack, preferred, role, groupIds, hasAccessOnly } = values
    const body = {}
    if (fullName.isChanged) body.fullName = fullName.value
    if (email.isChanged) body.email = email.value
    if (slack.isChanged) body.slack = slack.value
    if (preferred.isChanged) body.preferred = preferred.value
    if (role.isChanged) body.role = role.value
    if (groupIds.isChanged) body.groupIds = union(this.defaultGroups(), groupIds.value)
    if (hasAccessOnly.isChanged && role.value === 'manager') body.hasAccessOnly = hasAccessOnly.value
    return this.props.onSubmit(body, addAnother)
  }

  toggleRole = (e) => {
    const { isEdit, user } = this.props
    const values = { ...this.state.values }
    if (e.target.value === 'manager') {
      const possibleHAO = isEdit ? (user.role === 'manager' ? user.hasAccessOnly : intersection(this.availableGroupIds(), values.groupIds.value)) : []
      values.hasAccessOnly = {
        value: possibleHAO,
        isChanged: isEdit ? user.role !== 'manager' : false,
        isValid: isEdit && possibleHAO.length || false
      }
    }
    this.setState({ role: e.target.value, values })
    this.createChangeHandler('role')({
      value: e.target.value,
      isValid: true,
      isChanged: isEdit ? user.role !== e.target.value : true
    })
  }

  makePreferred = (value) => {
    const { isEdit, user } = this.props
    return () => {
      this.createChangeHandler('preferred')({
        value,
        isValid: true,
        isChanged: isEdit ? user.preferred !== value : true
      })
    }
  }

  onDeleteUser = (e) => {
    const { user } = this.props
    e.preventDefault()
    this.props.deleteUser(user._id)
    this.props.onClose()
  }

  onAddAnotherUser = (e) => {
    e.preventDefault()
    this.onSaveForm(e, true)
    this.props.onClose()
  }

  availableGroupIds () {
    const { activeGroups } = this.props
    return activeGroups.map((g) => g._id)
  }

  defaultGroups () {
    const { isEdit, user } = this.props
    const originalGroupIds = isEdit ? user.groupIds : []
    return difference(originalGroupIds, this.availableGroupIds())
  }

  createChangeHandler (prop) {
    return (opts, callback) => {
      const values = { ...this.state.values }
      values[prop] = opts
      const role = values.role.value
      const isValid = Object.keys(values).some((keyProp) => values[keyProp].isChanged) &&
        values.fullName.isValid &&
        values.email.isValid && (
          (role === 'user' && values.groupIds.isValid) ||
          (role === 'manager' && values.hasAccessOnly.isValid) ||
          (role === 'admin')
        )
      this.setState({ isDisabled: !isValid, values }, callback)
    }
  }

  render () {
    const { onClose, existingEmails, existingSlacks, activeGroups, isEdit, user, currentCompany } = this.props
    const { isDisabled, values, role } = this.state
    const footer = (
      <div className="bf-TeamFormFooter">
        <div className="bf-TeamFormFooter-links">
          {isEdit
            ? <a href="#" className="is-red" onClick={this.onDeleteUser}>{tn('delete-user')}</a>
            : <a href={isDisabled ? '' : '#'} disabled={isDisabled} onClick={this.onAddAnotherUser}>{tn('add-another-user')}</a>
          }
        </div>
        <FormButton
          isDisabled={isDisabled}
          icon={IconUser}
          text={isEdit ? tn('edit-user-button') : tn('add-user-button')}
          onClick={this.onSaveForm}
        />
      </div>
    )
    return (
      <Modal
        title={isEdit ? tn('edit-user') : tn('add-user')}
        onClose={onClose}
        footer={footer}
      >
        <div className="bf-TeamForm">
          <FormInputFullName
            defaultValue={isEdit ? user.fullName : ''}
            isRequired
            onChange={this.createChangeHandler('fullName')}
          />
          <TeamFormChannelInput field="email" values={values} existing={existingEmails} makePreferred={this.makePreferred}>
            <FormInputEmail
              defaultValue={isEdit ? user.email : ''}
              isRequired
              onChange={this.createChangeHandler('email')}
              existingEmails={existingEmails}
            />
          </TeamFormChannelInput>
          {currentCompany.isSlackEnabled ? (
            <TeamFormChannelInput field="slack" values={values} existing={existingSlacks} makePreferred={this.makePreferred}>
              <FormInputSlack
                defaultValue={isEdit ? user.slack : ''}
                onChange={this.createChangeHandler('slack')}
                existingSlacks={existingSlacks}
              />
            </TeamFormChannelInput>
          ) : null}
          <div className="bf-FormInput">
            <label>{tn('role')}:</label>
            <FormRadio group="role" value="user" isChecked={role === 'user'} label={tn('role-user')} onChange={this.toggleRole} />
            <FormRadio group="role" value="manager" isChecked={role === 'manager'} label={tn('role-manager')} onChange={this.toggleRole} />
            <FormRadio group="role" value="admin" isChecked={role === 'admin'} label={tn('role-admin')} onChange={this.toggleRole} />
          </div>
          <div className="bf-FormInput">
            <label>{tn('tags')}:</label>
            {activeGroups.length ? (
              <TeamTagsSelector
                key="user"
                allowsEmpty
                isManager={role === 'manager'}
                onChange={this.createChangeHandler('groupIds')}
                onAccessChange={this.createChangeHandler('hasAccessOnly')}
                groups={activeGroups}
                selected={values.groupIds.value}
                selectedForManagment={values.hasAccessOnly.value}
              />
            ) : (
              <div className="bf-TeamForm-text">
                {tn('tags-user-text')}
              </div>
            )}
          </div>
          {role === 'admin' ? (
            <div className="bf-TeamForm-text">
              {tn('admin-text')}
            </div>
          ) : null}
        </div>
      </Modal>
    )
  }
}

const TeamFormChannelInput = ({ field, existing, values, makePreferred, children }) => {
  const isActive = values.preferred.value !== field
  const { value, isValid, isChanged } = values[field]
  const className = classNames('bf-TeamFormChannelInput-input-preferred', {
    'is-active': isActive,
    'is-error': !isValid && isChanged,
    'is-valid': isValid && isChanged
  })
  return (
    <div className="bf-TeamFormChannelInput">
      <div className="bf-TeamFormChannelInput-input">
        {children}
        {isActive ? (
          <button type="button" className={className} onClick={makePreferred(field)}>
            {tn('make-preferred')}
          </button>
        ) : (
          <div className={className}>{tn('preferred')}</div>
        )}
      </div>
      {!isValid && existing.includes(value) ? (
        <div className="bf-TeamFormChannelInput-error">{tn('value-exists')}</div>
      ) : null}
    </div>
  )
}
