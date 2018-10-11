import React, { Component } from 'react'
import { InfoCallout } from '../../../../components/InfoCallout'
import { namespace } from '../../../../../../utils/locales'
import { Modal } from '../../../../components/Modal'
import { TeamTagsSelector } from '../TeamTagsSelector'
import './index.css'
const tn = namespace('dashboard.teams')

export class TeamTagsModal extends Component {
  constructor () {
    super()
    this.state = { isDisabled: true, selected: [] }
  }

  onSelection = ({ isValid, value }) => {
    this.setState({ isDisabled: !isValid, selected: value })
  }

  onSubmit = () => {
    return this.props.onTagUsers(this.state.selected)
  }

  render () {
    const { activeGroups, amountOfSelectedUsers, onClose } = this.props
    const { isDisabled } = this.state
    return (
      <Modal
        title={<span>
          {tn('tag-users', { count: amountOfSelectedUsers })}
          <InfoCallout isWhite text={tn('tag-needs-users')} />
        </span>}
        onSubmit={this.onSubmit}
        onClose={onClose}
        isDisabled={isDisabled}
        submitTitle={tn('tag-users-button')}
        footerAlign="right"
      >
        <div className="bf-TeamTagsModal">
          <TeamTagsSelector onChange={this.onSelection} groups={activeGroups} />
        </div>
      </Modal>
    )
  }
}
