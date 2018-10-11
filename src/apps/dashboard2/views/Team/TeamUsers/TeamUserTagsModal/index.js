import React, { Component } from 'react'
import { namespace } from '../../../../../../utils/locales'
import { Modal } from '../../../../components/Modal'
import { TeamTagsSelector } from '../TeamTagsSelector'
import './index.css'
const tn = namespace('dashboard.teams')

const isValid = state => state.groupIds.isValid && state.hasAccessOnly.isValid
const isDirty = state => state.groupIds.isChanged || state.hasAccessOnly.isChanged

export class TeamUserTagsModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isDisabled: true,
      groupIds: {
        value: props.user.groupIds,
        isValid: true,
        isChanged: false
      },
      hasAccessOnly: {
        value: props.user.hasAccessOnly,
        isValid: true,
        isChanged: false
      }
    }
  }

  onTagsChange = (opts, callback) => {
    const newState = {
      ...this.state,
      groupIds: opts
    }
    this.setState({ ...newState, isDisabled: !isValid(newState) || !isDirty(newState) }, callback)
  }

  onManagerChange = (opts) => {
    const newState = {
      ...this.state,
      hasAccessOnly: opts
    }
    this.setState({ ...newState, isDisabled: !isValid(newState) || !isDirty(newState) })
  }

  onSubmit = () => {
    return this.props.onSubmit({
      groupIds: this.state.groupIds.value,
      hasAccessOnly: this.state.hasAccessOnly.value
    })
  }

  render () {
    const { activeGroups, user, isAdmin, onClose } = this.props
    const { isDisabled, groupIds, hasAccessOnly } = this.state
    const isManager = isAdmin && user.role === 'manager'
    return (
      <Modal
        title={tn('tag-user', { name: user.fullName })}
        submitTitle={tn('tag-users-button')}
        isDisabled={isDisabled}
        onSubmit={this.onSubmit}
        onClose={onClose}
        footerAlign="right"
      >
        <div className="bf-TeamUserTagsModal">
          <TeamTagsSelector
            isManager={isManager}
            allowsEmpty
            onChange={this.onTagsChange}
            onAccessChange={this.onManagerChange}
            selected={groupIds.value}
            selectedForManagment={hasAccessOnly.value}
            groups={activeGroups}
          />
        </div>
      </Modal>
    )
  }
}
