import React, { Component } from 'react'
import { flatten } from 'lodash'
import { connect } from '../../../utils/performance'
import { exportUsersToCSV } from '../../../redux/csv-utils'
import { downloadFile } from '../../../utils/files'
import moment from '../../../utils/moment'
import {
  changeSearch, resetSearch,
  changeSortColumn, resetSortColumn,
  toggleSelection, changeSelection, resetSelection
} from '../../../redux/actions/teamTags'
import { removeGroupFromUser, removeManagmentGroupFromUser } from '../../../redux/actions/users'
import { createGroup, updateGroup, deleteGroup, deleteGroups } from '../../../redux/actions/groups'
import { getUsersLength, getGroupsLength, getMappedGroups } from '../../../redux/selectors/team'
import { getSearch, getSortColumn, getSelection, getSortedGroups, getAccessibleGroupsList, getSelectedGroupsList } from '../../../redux/selectors/teamTags'
import { getCurrentUser } from '../../../redux/selectors/users'
import { Container, ContainerHeader, ContainerBody } from '../../../components/Container'
import { TeamHeaderMenu } from '../TeamHeaderMenu'
import { TeamTagsHeaderDropdown } from './TeamTagsHeaderDropdown'
import { TeamTagsHeaderSearch } from './TeamTagsHeaderSearch'
import { TeamTagsCreateForm } from './TeamTagsCreateForm'
import { TeamTagsEditModal } from './TeamTagsEditModal'
import { TeamTagsDeleteModal, TeamTagsBulkDeleteModal } from './TeamTagsModal'
import { TeamTagsTable } from './TeamTagsTable'

const mapStateToProps = (state) => {
  const currentUser = getCurrentUser(state)
  const usersLength = getUsersLength(state)
  const groupsLength = getGroupsLength(state)
  const sortedGroups = getSortedGroups(state)
  const accessibleGroupsList = getAccessibleGroupsList(state)
  const selectedGroupsList = getSelectedGroupsList(state)
  const groups = getMappedGroups(state)
  const search = getSearch(state)
  const selection = getSelection(state)
  const sortColumn = getSortColumn(state)
  const { isAdmin, _id: currentUserId } = currentUser
  return {
    currentUserId,
    sortedGroups,
    groups,
    usersLength,
    groupsLength,
    accessibleGroupsList,
    selectedGroupsList,
    search,
    selection,
    sortColumn,
    isAdmin
  }
}

class TeamTags extends Component {
  constructor () {
    super()
    this.state = { deleteConfirmationModal: null, editModal: null, bulkDeleteConfirmation: false }
  }

  handleShowEditModal = (groupId) => {
    this.setState({ editModal: groupId })
  }

  handleCloseEditModal = () => {
    this.setState({ editModal: null })
  }

  handleShowDeleteConfirmation = (groupId) => {
    this.setState({ deleteConfirmationModal: groupId })
  }

  handleDeleteConfirmationClose = () => {
    this.setState({ deleteConfirmationModal: null })
  }

  handleCreate = (name) => {
    const { isAdmin, currentUserId, dispatch } = this.props
    const opts = { name, isAdmin, userId: currentUserId }
    return dispatch(createGroup(opts))
  }

  handleUpdate = ({ groupId, name, moodTracking, instantFeedback, removedUsers, removedManagers }) => {
    const { isAdmin, dispatch } = this.props
    const removedUsersRequests = removedUsers.map(userId => dispatch(removeGroupFromUser({ userId, groupId, isAdmin })))
    const removedManagersRequests = removedManagers.map(userId => dispatch(removeManagmentGroupFromUser({ userId, groupId, isAdmin })))
    return Promise.all(removedUsersRequests.concat(removedManagersRequests)).then(() => {
      return dispatch(updateGroup({ groupId, name, isAdmin, moodTracking, instantFeedback }))
    })
  }

  handleDelete = (groupId) => {
    const { isAdmin, dispatch } = this.props
    return dispatch(deleteGroup({ groupId, isAdmin }))
  }

  handleSearch = (term) => {
    this.props.dispatch(changeSearch(term))
  }

  handleSelect = (groupId, selected) => {
    this.props.dispatch(toggleSelection(groupId, selected))
  }

  handleSelection = (e) => {
    e.preventDefault()
    const { accessibleGroupsList, dispatch } = this.props
    const groupids = accessibleGroupsList.map(group => group._id)
    dispatch(changeSelection(groupids))
  }

  handleSortChange = (column) => {
    this.props.dispatch(changeSortColumn(column))
  }

  handleUsersExport = () => {
    const { groups, selectedGroupsList } = this.props
    const users = flatten(selectedGroupsList.map(tag => [].concat(tag.users || [], tag.managers || [])))
    downloadFile({
      name: 'users-' + moment(new Date()).format('YYYY-MM-DD'),
      extension: 'csv',
      content: exportUsersToCSV(users, groups)
    })
  }

  handleShowDeleteSelectedTagsConfirmation = () => {
    this.setState({ showDeleteSelectedTagsConfirmation: true })
  }

  handleCloseDeleteSelectedTagsConfirmation = () => {
    this.setState({ showDeleteSelectedTagsConfirmation: false })
  }

  handleDeleteSelectedTags = () => {
    const { isAdmin, selection, dispatch } = this.props
    const groupIds = Object.keys(selection)
    return dispatch(deleteGroups({ groupIds, isAdmin }))
    .then(() => dispatch(resetSelection()))
  }

  componentWillUnmount () {
    const { dispatch } = this.props
    dispatch(resetSearch())
    dispatch(resetSelection())
    dispatch(resetSortColumn())
  }

  render () {
    const { sortedGroups, groups, accessibleGroupsList, selectedGroupsList, usersLength, groupsLength, isAdmin, currentUserId, search, selection, sortColumn } = this.props
    const { deleteConfirmationModal, editModal, showDeleteSelectedTagsConfirmation } = this.state

    const isAnySelected = Object.keys(selection).length > 0
    const groupForDelete = groups[deleteConfirmationModal]
    const groupForUpdate = groups[editModal]
    return (
      <Container>
        <ContainerHeader>
          <TeamHeaderMenu
            groupsSize={groupsLength}
            usersSize={usersLength}
          />
          <TeamTagsHeaderSearch value={search} onSearch={this.handleSearch} />
          <TeamTagsHeaderDropdown
            isAnySelected={isAnySelected}
            onUsersExport={this.handleUsersExport}
            onDelete={this.handleShowDeleteSelectedTagsConfirmation}
          />
        </ContainerHeader>
        <ContainerBody>
          <div style={{ margin: '3rem 1.2rem' }}>
            <TeamTagsCreateForm onSubmit={this.handleCreate} />
            <TeamTagsTable
              groups={sortedGroups}
              accessibleGroups={accessibleGroupsList}
              selection={selection}
              sortColumn={sortColumn}
              currentUserId={currentUserId}
              onTagRemove={this.handleShowDeleteConfirmation}
              onTagEdit={this.handleShowEditModal}
              onTagSelect={this.handleSelect}
              onToggleSelection={this.handleSelection}
              onSortChange={this.handleSortChange}
            />
          </div>
          {groupForDelete ? (
            <TeamTagsDeleteModal
              groupId={groupForDelete._id}
              managersCount={groupForDelete.managersCount}
              usersCount={groupForDelete.usersCount}
              name={groupForDelete.name}
              isAdmin={isAdmin}
              onClose={this.handleDeleteConfirmationClose}
              onSubmit={this.handleDelete}
              onReassign={this.handleShowEditModal}
            />
          ) : null}
          {groupForUpdate ? (
            <TeamTagsEditModal
              groupId={groupForUpdate._id}
              name={groupForUpdate.name}
              users={groupForUpdate.users}
              managers={groupForUpdate.managers}
              moodTracking={groupForUpdate.moodTracking}
              instantFeedback={groupForUpdate.instantFeedback}
              isAdmin={isAdmin}
              onClose={this.handleCloseEditModal}
              onSubmit={this.handleUpdate}
            />
          ) : null}
          {showDeleteSelectedTagsConfirmation ? (
            <TeamTagsBulkDeleteModal
              groups={selectedGroupsList}
              isAdmin={isAdmin}
              onClose={this.handleCloseDeleteSelectedTagsConfirmation}
              onSubmit={this.handleDeleteSelectedTags}
            />
          ) : null}
        </ContainerBody>
      </Container>
    )
  }
}

export default connect(mapStateToProps)(TeamTags)
