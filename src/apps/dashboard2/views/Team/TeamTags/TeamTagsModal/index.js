import React, { PureComponent } from 'react'
import memoize from 'fast-memoize'
import { router } from '../../../../routes'
import { ModalAlert } from '../../../../components/Modal'
import { namespace } from '../../../../../../utils/locales'
const tn = namespace('dashboard.teams')

export class TeamTagsDeleteModal extends PureComponent {
  isManagersReassign () {
    const { isAdmin, managersCount } = this.props
    return isAdmin && managersCount > 0
  }

  isUsersReassign () {
    const { usersCount } = this.props
    return usersCount > 0
  }

  isReassign () {
    return this.isManagersReassign() || this.isUsersReassign()
  }

  handleSubmit = () => {
    const { groupId, onSubmit, onReassign } = this.props
    if (this.isReassign()) {
      return onReassign(groupId)
    }
    return onSubmit(groupId)
  }

  submitTitle () {
    const isManagersReassign = this.isManagersReassign()
    const isUsersReassign = this.isUsersReassign()
    if (isManagersReassign && isUsersReassign) return tn('reassign-button')
    if (isManagersReassign) return tn('reassign-managers-button')
    if (isUsersReassign) return tn('reassign-users-button')
    return tn('delete-button')
  }

  text () {
    const isManagersReassign = this.isManagersReassign()
    const isUsersReassign = this.isUsersReassign()
    const { managersCount, usersCount, name } = this.props
    if (isManagersReassign && isUsersReassign) return tn('delete-reassign', { managersCount, usersCount, name })
    if (isManagersReassign) return tn('delete-managers-reassign', { managersCount, name })
    if (isUsersReassign) return tn('delete-users-reassign', { usersCount, name })
    return tn('delete-confirm', { name })
  }

  render () {
    const { onClose } = this.props
    const submitTitle = this.submitTitle()
    const text = this.text()
    return (
      <ModalAlert
        isWarning
        title={tn('delete-tag-title')}
        text={text}
        submitTitle={submitTitle}
        closeOnSubmit={false}
        onClose={onClose}
        onSubmit={this.handleSubmit}
      />
    )
  }
}

export class TeamTagsBulkDeleteModal extends PureComponent {
  constructor () {
    super()
    this.getManagersCount = memoize(groups => groups.reduce((result, group) => result + group.managers.length, 0))
    this.getUsersCount = memoize(groups => groups.reduce((result, group) => result + group.users.length, 0))
    this.getNames = memoize(groups => groups.map(group => group.name).join(', '))
  }

  isManagersReassign () {
    const { isAdmin } = this.props
    return isAdmin && this.managersCount() > 0
  }

  isUsersReassign () {
    return this.usersCount() > 0
  }

  isReassign () {
    return this.isManagersReassign() || this.isUsersReassign()
  }

  managersCount () {
    return this.getManagersCount(this.props.groups)
  }

  usersCount () {
    return this.getUsersCount(this.props.groups)
  }

  names () {
    return this.getNames(this.props.groups)
  }

  handleSubmit = () => {
    const { onSubmit } = this.props
    if (this.isReassign()) {
      return router.push('/team')
    }
    return onSubmit()
  }

  submitTitle () {
    const isManagersReassign = this.isManagersReassign()
    const isUsersReassign = this.isUsersReassign()
    if (isManagersReassign && isUsersReassign) return tn('reassign-button')
    if (isManagersReassign) return tn('reassign-managers-button')
    if (isUsersReassign) return tn('reassign-users-button')
    return tn('delete-button')
  }

  text () {
    const isManagersReassign = this.isManagersReassign()
    const isUsersReassign = this.isUsersReassign()
    const managersCount = this.managersCount()
    const usersCount = this.usersCount()
    const names = this.names()
    if (isManagersReassign && isUsersReassign) return tn('bulk-delete-reassign', { managersCount, usersCount, names })
    if (isManagersReassign) return tn('bulk-delete-managers-reassign', { managersCount, names })
    if (isUsersReassign) return tn('bulk-delete-users-reassign', { usersCount, names })
    return tn('delete-confirm', { name: names })
  }

  render () {
    const { onClose } = this.props
    const submitTitle = this.submitTitle()
    const text = this.text()
    return (
      <ModalAlert
        isWarning
        title={tn('delete-tags-title')}
        text={text}
        submitTitle={submitTitle}
        onClose={onClose}
        onSubmit={this.handleSubmit}
      />
    )
  }
}
