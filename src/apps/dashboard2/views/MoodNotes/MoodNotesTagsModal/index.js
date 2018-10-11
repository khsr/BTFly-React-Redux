import React, { PureComponent } from 'react'
import classNames from 'classnames'
import { values, pickBy } from 'lodash'
import { EmbedModalBackdrop } from '../../../components/Modal'
import { FormCheck } from '../../../components/FormCheck'
import { CloseButton } from '../../../components/CloseButton'
import { namespace } from '../../../../../utils/locales'

import './index.css'
const tn = namespace('dashboard.mood-notes')

const getSelectedGroups = ({ noteGroupIds, allCompany, groups }) => {
  let baseArray = allCompany ? groups.map(group => group._id) : noteGroupIds
  return baseArray.reduce((result, id) => { result[id] = true; return result }, {})
}

export class MoodNotesTagsModal extends PureComponent {
  constructor (props) {
    super(props)

    const { note: { groupIds: noteGroupIds, allCompany }, groups } = props
    const selectedGroups = getSelectedGroups({ noteGroupIds, allCompany, groups })
    this.state = {
      selectedGroups,
      allCompany
    }
  }

  handleTagSelect = (groupId) => {
    const { selectedGroups } = this.state
    this.setState({
      selectedGroups: { ...selectedGroups, [groupId]: !selectedGroups[groupId] },
      allCompany: false
    })
  }

  handleAllCompanySelect = (e) => {
    e.preventDefault()
    const allCompany = !this.state.allCompany
    const { note: { groupIds: noteGroupIds }, groups } = this.props
    const selectedGroups = allCompany ? getSelectedGroups({ noteGroupIds, allCompany, groups }) : this.state.selectedGroups
    this.setState({ allCompany, selectedGroups })
  }

  handleMakePrivateSelect = (e) => {
    e.preventDefault()
    this.setState({ selectedGroups: {}, allCompany: false })
  }

  handleConfirmClick = (e) => {
    e.preventDefault()
    const { onSubmit, note } = this.props
    const { selectedGroups, allCompany } = this.state
    const groupIds = Object.keys(pickBy(selectedGroups, value => value))
    onSubmit(note._id, { groupIds, allCompany })
  }

  handleCloseClick = (e) => {
    e.preventDefault()
    this.props.onClose()
  }

  render () {
    const { groups, companyName, isAdmin } = this.props
    const { selectedGroups, allCompany } = this.state
    const canMarkPrivate = allCompany || values(selectedGroups).some(v => v)
    return (
      <EmbedModalBackdrop isWhite>
        <div className="bf-MoodNotesTagsModal">
          <div className="bf-MoodNotesTagsModal-header">
            <h4 className="bf-MoodNotesTagsModal-title">{tn('changing-tags-title')}</h4>
            <CloseButton isGreen isWithoutBox onClose={this.handleCloseClick} />
          </div>
          <div className="bf-MoodNotesTagsModal-description">
            {tn('changing-tags-description')}
          </div>
          <div className="bf-MoodNotesTagsModal-tags">
            {isAdmin ? (
              <div className={`bf-MoodNotesTagsModal-tag is-allCompany${allCompany ? ' is-active' : ''}`}>
                <FormCheck isSmall onClick={this.handleAllCompanySelect} isChecked={allCompany} />
                <span className="bf-MoodNotesTagsModal-tag-name">{companyName}</span>
                <span className="bf-MoodNotesTagsModal-tag-remark">({tn('changing-tags-everyone-remark')})</span>
              </div>
            ) : null}
            {groups.map(group => (
              <MoodNotesTagsModalElement
                key={group._id}
                id={group._id}
                onSelect={this.handleTagSelect}
                isChecked={selectedGroups[group._id] || false}
                name={group.name}
                users={group.managers}
              />
            ))}
          </div>
          <div className="bf-MoodNotesTagsModal-footer">
            {canMarkPrivate ? (
              <a className="bf-MoodNotesTagsModal-makePrivate" onClick={this.handleMakePrivateSelect}>{tn('changing-tags-make-private')}</a>
            ) : <div />}
            <a className="bf-MoodNotesTagsModal-confirm" onClick={this.handleConfirmClick}>{tn('changing-tags-confirm')}</a>
          </div>
        </div>
      </EmbedModalBackdrop>
    )
  }
}

class MoodNotesTagsModalElement extends PureComponent {
  handleCheckBoxSelect = (e) => {
    e.preventDefault()
    this.props.onSelect(this.props.id)
  }

  render () {
    const { isChecked, name, users } = this.props
    const className = classNames('bf-MoodNotesTagsModal-tag', {
      'is-active': isChecked
    })
    const userNames = users.map(user => user.fullName).join(', ')
    return (
      <div className={className}>
        <FormCheck isSmall onClick={this.handleCheckBoxSelect} isChecked={isChecked} />
        <span className="bf-MoodNotesTagsModal-tag-name">{name}</span>
        {userNames.length > 0 ? (
          <span className="bf-MoodNotesTagsModal-tag-remark">({userNames})</span>
        ) : null}
      </div>
    )
  }
}
