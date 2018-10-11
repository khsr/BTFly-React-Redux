import React, { PureComponent } from 'react'
import classNames from 'classnames'
import { Modal } from '../../../../components/Modal'
import { FormToggler } from '../../../../components/FormToggler'
import { FormButton } from '../../../../components/FormButton'
import { FormInput } from '../../../../components/FormInput'
import { InfoCallout } from '../../../../components/InfoCallout'
import { IconCancel } from '../../../../components/Icon'
import { namespace } from '../../../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.teams')

export class TeamTagsEditModal extends PureComponent {
  constructor (props) {
    super()
    this.state = {
      isSubmitting: false,
      name: {
        value: props.name,
        initialValue: props.name
      },
      instantFeedback: {
        value: !!props.instantFeedback,
        initialValue: !!props.instantFeedback
      },
      moodTracking: {
        value: !!props.moodTracking,
        initialValue: !!props.moodTracking
      },
      removedManagers: {},
      removedUsers: {}
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { groupId, onSubmit, onClose } = this.props
    const { name, moodTracking, instantFeedback, removedManagers, removedUsers } = this.state
    if (!this.isFormDisabled()) {
      this.setState({ isSubmitting: true })
      return onSubmit({
        groupId,
        name: name.value,
        moodTracking: moodTracking.value,
        instantFeedback: instantFeedback.value,
        removedManagers: Object.keys(removedManagers),
        removedUsers: Object.keys(removedUsers)
      })
      .then(() => { onClose() })
    }
  }

  handleDelete = (e) => {
    e.preventDefault()
    this.props.onDelete()
  }

  handleNameChange = ({ value }) => {
    this.setState({ name: { ...this.state.name, value } })
  }

  handleInstantFeedbackChange = (e) => {
    e.preventDefault()
    const { value, ...tail } = this.state.instantFeedback
    this.setState({ instantFeedback: { ...tail, value: !value } })
  }

  handleMoodTrackingChange = (e) => {
    e.preventDefault()
    const { value, ...tail } = this.state.moodTracking
    this.setState({ moodTracking: { ...tail, value: !value } })
  }

  handleRemoveUser = (userId) => {
    const { removedUsers } = this.state
    this.setState({ removedUsers: { ...removedUsers, [userId]: true } })
  }

  handleRemoveManager = (userId) => {
    const { removedManagers } = this.state
    this.setState({ removedManagers: { ...removedManagers, [userId]: true } })
  }

  isFormValid () {
    const { name } = this.state
    return name.value.trim().length > 0
  }

  isFormChanged () {
    const { name, instantFeedback, moodTracking, removedManagers, removedUsers } = this.state
    return name.value.trim() !== name.initialValue ||
      instantFeedback.value !== instantFeedback.initialValue || moodTracking.value !== moodTracking.initialValue ||
      Object.keys(removedManagers).length !== 0 || Object.keys(removedUsers).length !== 0
  }

  isFormDisabled () {
    return !this.isFormValid() || !this.isFormChanged()
  }

  render () {
    const { users, managers, isAdmin, onClose } = this.props
    const { name, instantFeedback, moodTracking, removedManagers, removedUsers, isSubmitting } = this.state
    const filteredUsers = users.filter(({ _id }) => !removedUsers[_id])
    const filteredManagers = managers.filter(({ _id }) => !removedManagers[_id])
    const isDisabled = this.isFormDisabled()
    const footer = (
      <div className="bf-TeamTagsEditModal-footer">
        <div className="bf-TeamTagsEditModal-togglers">
          <div className="bf-TeamTagsEditModal-toggle">
            <FormToggler isCheck={moodTracking.value} onToggle={this.handleMoodTrackingChange} />
            <span>{tn('edit-tag-mood-tracking-button')}</span>
            <InfoCallout text={tn('edit-tag-mood-tracking-popup')} />
          </div>
          <div className="bf-TeamTagsEditModal-toggle">
            <FormToggler isCheck={instantFeedback.value} onToggle={this.handleInstantFeedbackChange} />
            <span>{tn('edit-tag-instant-feedback-button')}</span>
            <InfoCallout text={tn('edit-tag-instant-feedback-popup')} />
          </div>
        </div>
        <div className="bf-TeamTagsEditModal-footer-buttons">
          <a onClick={this.handleDelete}>{tn('delete-tag-title')}</a>
          <FormButton isDisabled={isDisabled || isSubmitting} isLoading={isSubmitting} onClick={this.handleSubmit} text={tn('edit-tag-button')} />
        </div>
      </div>
    )
    return (
      <Modal
        title={tn('edit-tag')}
        onClose={onClose}
        footer={footer}
      >
        <div className="bf-TeamTagsEditModal">
          <FormInput isRequired isFullWidth defaultValue={name.initialValue} onChange={this.handleNameChange} />
          {users.length || managers.length ? (
            <div className="bf-TeamTagsEditModal-users">
              {filteredManagers.map(({ _id, fullName }) => (
                <TeamTagsEditModalUser
                  key={_id}
                  isAdmin={isAdmin}
                  id={_id}
                  fullName={fullName}
                  isManager
                  onRemove={this.handleRemoveUser}
                  onRemoveManager={this.handleRemoveManager}
                />
              ))}
              {filteredUsers.map(({ _id, fullName }) => (
                <TeamTagsEditModalUser
                  key={_id}
                  isAdmin={isAdmin}
                  id={_id}
                  fullName={fullName}
                  onRemove={this.handleRemoveUser}
                />
              ))}
            </div>
          ) : null}
        </div>
      </Modal>
    )
  }
}

class TeamTagsEditModalUser extends PureComponent {
  handleRemoveClick = (e) => {
    e.preventDefault()
    const { id, onRemove } = this.props
    onRemove(id)
  }

  handleRemoveManagerClick = (e) => {
    e.preventDefault()
    const { id, onRemoveManager } = this.props
    onRemoveManager(id)
  }

  render () {
    const { fullName, isManager, isAdmin } = this.props
    const className = classNames('bf-TeamTagsEditModal-user', {
      'is-manager': isManager
    })
    return (
      <div className={className}>
        <span className="bf-TeamTagsEditModal-user-name">{fullName}</span>
        <span className="bf-TeamTagsEditModal-user-suffix">{isManager ? '(Manager)' : null}</span>
        {isAdmin && isManager ? (
          <a onClick={this.handleRemoveManagerClick}>{tn('edit-tag-remove-manager')}</a>
        ) : null}
        {!isManager ? <IconCancel onClick={this.handleRemoveClick} /> : null}
      </div>
    )
  }
}
