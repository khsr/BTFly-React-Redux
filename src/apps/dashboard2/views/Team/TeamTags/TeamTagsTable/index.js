import React, { PureComponent } from 'react'
import classNames from 'classnames'
import { FormCheck } from '../../../../components/FormCheck'
import { InfoCallout } from '../../../../components/InfoCallout'
import { IconCancel } from '../../../../components/Icon'
import { namespace } from '../../../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.teams')

export class TeamTagsTable extends PureComponent {
  constructor () {
    super()
    this.handleNameClick = this.createSortHandler('name')
    this.handleMoodTrackingClick = this.createSortHandler('moodTracking')
    this.handleInstantFeedbackClick = this.createSortHandler('instantFeedback')
  }

  createSortHandler (column) {
    return (e) => {
      e.preventDefault()
      this.props.onSortChange(column)
    }
  }

  render () {
    const { groups, accessibleGroups, currentUserId, selection, sortColumn, onTagRemove, onTagEdit, onTagSelect, onToggleSelection } = this.props
    const selectedTagsLength = Object.keys(selection).length
    const accessibleGroupsLength = accessibleGroups.length
    return (
      <div className="bf-TeamTagsTable">
        <div className="bf-TeamTagsTable-header">
          <Row>
            <Cell type="checkbox">
              <FormCheck
                isChecked={accessibleGroupsLength && selectedTagsLength >= accessibleGroupsLength}
                isPartial={selectedTagsLength && selectedTagsLength < accessibleGroupsLength}
                onClick={onToggleSelection}
              />
            </Cell>
            <HeaderCell type="name" text={tn('tags-table-header-name')} isActive={sortColumn === 'name'} onClick={this.handleNameClick} />
            <HeaderCell type="moodTracking" text={tn('tags-table-header-mood-tracking')} isActive={sortColumn === 'moodTracking'} onClick={this.handleMoodTrackingClick} />
            <HeaderCell type="instantFeedback" text={tn('tags-table-header-instant-feedback')} isActive={sortColumn === 'instantFeedback'} onClick={this.handleInstantFeedbackClick} />
            <Cell type="removeButton" />
          </Row>
        </div>
        <div className="bf-TeamTagsTable-body">
          {groups.map(group =>
            <TagRow
              key={group._id}
              group={group}
              currentUserId={currentUserId}
              isSelected={!!selection[group._id]}
              onRemove={onTagRemove}
              onEdit={onTagEdit}
              onSelect={onTagSelect}
            />
          )}
        </div>
      </div>
    )
  }
}

const Row = ({ children, isForeign, isPrivate, isLarge }) => {
  const className = classNames('bf-TeamTagsTable-row', {
    'is-large': isLarge,
    'is-foreign': isForeign,
    'is-private': !isForeign && isPrivate
  })
  return (
    <div className={className}>
      {children}
    </div>
  )
}

const HeaderCell = (props) => {
  const { isActive, text, onClick } = props
  const onClickFn = isActive ? null : onClick
  return (
    <Cell {...props}>
      <span className={isActive ? 'is-active' : ''} onClick={onClickFn}>{text}</span>
    </Cell>
  )
}

const Cell = ({ children, type }) => {
  const newClassName = classNames('bf-TeamTagsTable-cell', {
    [`is-${type}`]: type
  })
  return (
    <div className={newClassName}>
      {children}
    </div>
  )
}

class TagRow extends PureComponent {
  handleRemoveClick = (e) => {
    e.preventDefault()
    const { onRemove, group: { _id } } = this.props
    onRemove(_id)
  }

  handleEditClick = (e) => {
    e.preventDefault()
    const { onEdit, group: { _id } } = this.props
    onEdit(_id)
  }

  handleSelect = (e) => {
    e.preventDefault()
    const { onSelect, group: { _id }, isSelected } = this.props
    onSelect(_id, isSelected)
  }

  render () {
    const { group, currentUserId, isSelected } = this.props
    return (
      <Row isForeign={group.isDisabled} isPrivate={group.isInactive} isLarge={group.usersCount >= 10} >
        <Cell type="checkbox">
          {!group.isDisabled ? (
            <FormCheck
              isChecked={isSelected}
              onClick={this.handleSelect}
            />
          ) : (
            <InfoCallout isWhite text={tn('tags-table-foreign-tag-popup')} />
          )}
        </Cell>
        <Cell type="name">
          <div className="bf-TeamTagsTable-nameCell">
            <span
              className={classNames('bf-TeamTagsTable-nameCell-name', { 'is-actionable': !group.isDisabled })}
              onClick={!group.isDisabled ? this.handleEditClick : undefined}
            >
              {group.name}
            </span>
            <span className="bf-TeamTagsTable-nameCell-count"> {group.usersCount}</span>
            {!group.isDisabled && group.isInactive ? <InfoCallout isWhite text={tn('tag-needs-users')} /> : null}
            {!group.isInactive && group.managers.length ? <span> (<NameCellManagers managers={group.managers} currentUserId={currentUserId} />)</span> : null}
          </div>
        </Cell>
        <Cell type="moodTracking">{group.moodTracking ? tn('yes') : tn('no')}</Cell>
        <Cell type="instantFeedback">{group.instantFeedback ? tn('yes') : tn('no')}</Cell>
        <Cell type="removeButton">{!group.isDisabled ? <IconCancel onClick={this.handleRemoveClick} /> : null}</Cell>
      </Row>
    )
  }
}

class NameCellManagers extends PureComponent {
  render () {
    const { currentUserId, managers } = this.props
    const managersLength = managers.length
    return (
      <span className="bf-TeamTagsTable-nameCell-managers">
        {managers.map((manager, index) => {
          const name = manager._id === currentUserId ? tn('tags-table-you') : manager.fullName
          const separator = index < managersLength - 2 ? ', ' : (index < managersLength - 1 ? ' & ' : null)
          return <span key={manager._id}>{name}{separator}</span>
        })}
      </span>
    )
  }
}
