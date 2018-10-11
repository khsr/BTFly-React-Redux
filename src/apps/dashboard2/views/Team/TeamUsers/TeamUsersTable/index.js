import React, { PureComponent } from 'react'
import classNames from 'classnames'
import { Link } from 'react-router'
import moment from '../../../../utils/moment'
import { namespace } from '../../../../../../utils/locales'
import { Spinner } from '../../../../components/Spinner'
import { FormCheck } from '../../../../components/FormCheck'
import { InfoCallout } from '../../../../components/InfoCallout'
import { IconResend } from '../../../../components/Icon'
import './index.css'

const tn = namespace('dashboard.teams')

export class TeamUsersTable extends PureComponent {
  constructor () {
    super()
    this.handleFullNameClick = this.createSortHandler('fullName')
    this.handlePreferredClick = this.createSortHandler('preferred')
    this.handleUpdatedAtClick = this.createSortHandler('updatedAt')
  }

  createSortHandler (column) {
    return (e) => {
      e.preventDefault()
      this.props.onSortChange(column)
    }
  }

  render () {
    const { users, groups, selected, isAdmin, currentUserId, sortColumn,
      onSelectUser, onEditUser, onEditUserTags, onResendInvite,
      toggleSelectedUsers, resendingInvites } = this.props

    const selectedUsersLength = Object.keys(selected).length

    return (
      <div>
        <div className="bf-TeamUsers">
          <div className="bf-TeamUsersHeader">
            <Row>
              <Cell type="checkbox">
                <FormCheck
                  isFull={users.length && selectedUsersLength > users.length}
                  isChecked={users.length && selectedUsersLength === users.length}
                  isPartial={selectedUsersLength && selectedUsersLength < users.length}
                  onClick={toggleSelectedUsers}
                />
              </Cell>
              <HeaderCell
                text={tn('table-header-full-name')}
                isActive={sortColumn === 'fullName'}
                onClick={this.handleFullNameClick}
                type="fullname"
              />
              <HeaderCell
                text={tn('table-header-channel')}
                isActive={sortColumn === 'preferred'}
                onClick={this.handlePreferredClick}
                type="channel"
              />
              <HeaderCell
                text={tn('table-header-modified')}
                isActive={sortColumn === 'updatedAt'}
                onClick={this.handleUpdatedAtClick}
                type="modified"
              />
            </Row>
          </div>
          <div className="bf-TeamUsersBody">
            {users.map(user => (
              <TeamUsersRow
                key={user._id}
                user={user}
                groups={groups}
                isAdmin={isAdmin}
                isSelected={!!selected[user._id]}
                currentUserId={currentUserId}
                onSelectUser={onSelectUser}
                onEditUser={onEditUser}
                onEditUserTags={onEditUserTags}
                onResendInvite={onResendInvite}
                isInviteResending={!!resendingInvites[user._id]}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }
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

class TeamUsersRow extends PureComponent {
  handleSelectUser = (e) => {
    e.preventDefault()
    const { onSelectUser, user: { _id: id }, isSelected } = this.props
    onSelectUser(id, isSelected)
  }

  handleEditUser = (e) => {
    e.preventDefault()
    const { onEditUser, user: { _id: id } } = this.props
    onEditUser(id)
  }

  handleEditUserTags = (e) => {
    e.preventDefault()
    const { onEditUserTags, user: { _id: id } } = this.props
    onEditUserTags(id)
  }

  handleResendInvite = (e) => {
    e.preventDefault()
    const { onResendInvite, user: { _id: id } } = this.props
    onResendInvite(id)
  }

  render () {
    const {
      user, groups, isInviteResending, isAdmin, currentUserId, isSelected
    } = this.props
    return (
      <Row selected={isSelected}>
        <Cell type="checkbox">
          <FormCheck isChecked={isSelected} onClick={this.handleSelectUser} />
        </Cell>
        <Cell type="fullname">
          <TeamUsersFullName
            isAdmin={isAdmin}
            groups={groups}
            isCurrentUser={user._id === currentUserId}
            user={user}
            onEditClick={this.handleEditUser}
            onEditTagsClick={this.handleEditUserTags}
            onResendClick={this.handleResendInvite}
            isResending={isInviteResending}
          />
        </Cell>
        <Cell type="channel">{user.preferred}</Cell>
        <Cell type="modified">{moment(user.updatedAt).format('YYYY.MM.DD - h:mm a')}</Cell>
      </Row>
    )
  }
}

const Cell = ({ children, type }) => {
  const newClassName = classNames('bf-TeamUsersCell', {
    [`is-${type}`]: type
  })
  return (
    <div className={newClassName}>
      {children}
    </div>
  )
}

const Row = ({ children, selected }) => {
  const className = classNames('bf-TeamUsersRow', {
    'is-selected': selected
  })
  return (
    <div className={className}>
      {children}
    </div>
  )
}

class TeamUsersFullName extends PureComponent {
  render () {
    const { groups, user, isCurrentUser, isAdmin, isResending, onEditClick, onEditTagsClick, onResendClick } = this.props
    const shouldShowResendButton = !isResending && isAdmin && !user.alreadyLoggedIn && user.role !== 'user'
    return (
      <div className="bf-TeamUsersFullName">
        <TeamUsersFullNameName fullName={user.fullName} isCurrentUser={isCurrentUser} isAdmin={isAdmin} onClick={onEditClick} />
        <TeamUsersFullNameTags
          role={user.role}
          groupIds={user.groupIds}
          hasAccessOnly={user.hasAccessOnly}
          groups={groups}
          onClick={onEditTagsClick}
        />
        {shouldShowResendButton ? (
          <InfoCallout placement="top" text={tn('resend-invite')}>
            <div className="bf-TeamUsersFullName-resendButton" onClick={onResendClick}><IconResend /></div>
          </InfoCallout>
        ) : null}
        {isResending ? <div className="bf-TeamUsersFullName-resendButton"><Spinner /></div> : null}
      </div>
    )
  }
}

class TeamUsersFullNameName extends PureComponent {
  render () {
    const { fullName, onClick, isCurrentUser, isAdmin } = this.props
    if (isAdmin) {
      return (
        <a className="bf-TeamUsersFullName-name is-action" onClick={onClick}>
          {fullName} {isCurrentUser ? <span className="bf-TeamUsersFullName-name-suffix">{tn('table-you')}</span> : null}
        </a>
      )
    } else if (isCurrentUser) {
      return (
        <Link className="bf-TeamUsersFullName-name is-action" to="/profile">
          {fullName} <span className="bf-TeamUsersFullName-name-suffix">{tn('table-you')}</span>
        </Link>
      )
    } else {
      return <span className="bf-TeamUsersFullName-name">{fullName}</span>
    }
  }
}

class TeamUsersFullNameTags extends PureComponent {
  render () {
    const { role, groupIds, hasAccessOnly, groups, onClick } = this.props
    const isManager = role === 'manager'
    const tags = groups.filter(group => groupIds.includes(group._id) || isManager && hasAccessOnly.includes(group._id))
    const tagsLength = tags.length

    if (tags.length === 0) return <div className="bf-TeamUsersFullName-addTags" onClick={onClick}>{tn('add-tags')}</div>

    return (
      <div className="bf-TeamUsersFullName-tags" onClick={onClick}>
        {tags.map((group, index) => {
          const isGroupManager = isManager && hasAccessOnly.includes(group._id)
          const suffix = isGroupManager ? <b> {tn('manager-shortcut')}</b> : null
          const seprator = index < tagsLength - 2 ? ', ' : (index < tagsLength - 1 ? ' & ' : null)
          return <span key={group._id}>{group.name}{suffix}{seprator}</span>
        })}
      </div>
    )
  }
}
