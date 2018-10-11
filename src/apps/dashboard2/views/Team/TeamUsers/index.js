import React, { Component } from 'react'
import { omit } from 'lodash'
import { connect } from '../../../utils/performance'
import { exportUsersToCSV } from '../../../redux/csv-utils'
import { downloadFile, uploadFile } from '../../../utils/files'
import moment from '../../../utils/moment'
import {
  updateUsersGroups, uploadUsers,
  deleteUser, deleteUsers, createUser, updateUser, sendInvitationForUser
} from '../../../redux/actions/users'
import {
  changeSearchTerm, changeSearchFilter, resetSearch,
  changeSortColumn, resetSortColumn,
  changePage, changeRecordsPerPage, resetPagination,
  toggleSelection, changeSelection, resetSelection
} from '../../../redux/actions/teamUsers'
import { getMappedGroups, getGroupsLength, getUsersLength } from '../../../redux/selectors/team'
import {
  getMappedUsers, getMappedUsersList, getPaginatedUsers, getSelectedUsers,
  getExistingEmails, getExistingSlacks,
  getSearch, getSortColumn, getPagination, getUsersSelection,
  getSortedGroups, getActiveGroups
} from '../../../redux/selectors/teamUsers'
import { getCurrentCompany } from '../../../redux/selectors/company'
import { getCurrentUser } from '../../../redux/selectors/users'
import { Container, ContainerHeader, ContainerBody } from '../../../components/Container'
import { TeamHeaderMenu } from '../TeamHeaderMenu'
import { TeamHeaderSearch } from './TeamHeaderSearch'
import { TeamHeaderCreateUser } from './TeamHeaderCreateUser'
import { TeamHeaderDropdown } from './TeamHeaderDropdown'
import { TeamUsersTable } from './TeamUsersTable'
import { TeamUsersImport } from './TeamUsersImport'
import { TeamModalError, TeamModalDeleteUsers } from './TeamModal'
import { TeamForm } from './TeamForm'
import { TeamTagsModal } from './TeamTagsModal'
import { TeamUserTagsModal } from './TeamUserTagsModal'
import { TeamUsersPaginator } from './TeamUsersPaginator'
import { TeamUsersImportModal } from './TeamUsersImportModal'

const mapStateToProps = (state) => {
  const currentUser = getCurrentUser(state)
  const usersLength = getUsersLength(state)
  const groupsLenth = getGroupsLength(state)
  const { isAdmin, _id: currentUserId } = currentUser
  const { isSmall } = state
  const isNew = isAdmin && usersLength < 4
  return {
    currentUserId,
    users: getMappedUsers(state),
    usersList: getMappedUsersList(state),
    groups: getMappedGroups(state),
    sortedGroups: getSortedGroups(state),
    activeGroups: getActiveGroups(state),
    paginatedUsers: getPaginatedUsers(state),
    selectedUsers: getSelectedUsers(state),
    existingEmails: getExistingEmails(state),
    existingSlacks: getExistingSlacks(state),
    currentCompany: getCurrentCompany(state),
    usersLength,
    groupsLenth,

    sortColumn: getSortColumn(state),
    search: getSearch(state),
    pagination: getPagination(state),
    selected: getUsersSelection(state),
    isNew,
    isAdmin,
    isSmall
  }
}

class TeamUsers extends Component {
  constructor () {
    super()
    this.state = {
      resendingInvites: {},
      importError: null,
      editUserId: null,
      showTagsModal: false,
      showDeleteModal: false,
      showCreateModal: false,
      showUsersImportModal: false
    }
  }

  handleSearch = (term) => {
    this.props.dispatch(changeSearchTerm(term))
  }

  handleSearchFilter = (value) => {
    this.props.dispatch(changeSearchFilter(value))
  }

  handleSortChange = (column) => {
    this.props.dispatch(changeSortColumn(column))
  }

  onDownloadUsers = () => {
    const { selectedUsers, usersList, groups } = this.props
    const users = selectedUsers.length === 0 ? usersList : selectedUsers
    downloadFile({
      name: 'users-' + moment(new Date()).format('YYYY-MM-DD'),
      extension: 'csv',
      content: exportUsersToCSV(users, groups)
    })
  }

  toggleSelectedUsers = (e) => {
    e.preventDefault()
    const { paginatedUsers, dispatch } = this.props
    const usersIds = paginatedUsers.map(u => u._id)
    dispatch(changeSelection(usersIds))
  }

  handleSelectAllUsers = () => {
    const { usersList, dispatch } = this.props
    const usersIds = usersList.map(u => u._id)
    dispatch(changeSelection(usersIds))
  }

  onImportUsersFile = () => {
    return uploadFile({ type: 'dataURL', accept: '.csv' })
    .then(data => this.props.dispatch(uploadUsers(data)))
    .catch(err => {
      switch (err.type) {
        case 'fileNotSelected': return
        default: return this.setState({ importError: err.toString() })
      }
    })
  }

  onTagUsers = () => {
    this.setState({ showTagsModal: true })
  }

  onDeleteUsers = () => {
    this.setState({ showDeleteModal: true })
  }

  onCreateUsers = () => {
    this.setState({ showCreateModal: true })
  }

  onImportUsers = () => {
    this.setState({ showUsersImportModal: true })
  }

  createCloseModal = (modalProp) => {
    return () => this.setState({ [modalProp]: null })
  }

  onEditUser = (editUserId) => {
    this.setState({ editUserId })
  }

  onSelectUser = (userId, isSelected) => {
    this.props.dispatch(toggleSelection(userId, isSelected))
  }

  handleEditUserTags = (userId) => {
    this.setState({ editUserTagsId: userId })
  }

  tagUsers = (groupIds) => {
    const { isAdmin, dispatch, selected } = this.props
    const userIds = Object.keys(selected)
    return dispatch(updateUsersGroups({ userIds, groupIds, isAdmin }))
    .then(() => dispatch(resetSelection()))
  }

  deleteUser = (userId) => {
    this.props.dispatch(deleteUser(userId))
  }

  deleteSelectedUsers = () => {
    const { dispatch, selected } = this.props
    const userIds = Object.keys(selected)
    return dispatch(deleteUsers(userIds))
    .then(() => dispatch(resetSelection()))
  }

  createUser = (body, addAnother) => {
    const { dispatch } = this.props
    if (addAnother) setTimeout(this.onCreateUsers)
    return dispatch(createUser(body))
  }

  updateUser = (body) => {
    const { dispatch } = this.props
    const { editUserId } = this.state
    return dispatch(updateUser(editUserId, body))
  }

  handleUpdateUserTags = (body) => {
    const { dispatch, isAdmin } = this.props
    const { editUserTagsId } = this.state
    if (isAdmin) {
      return dispatch(updateUser(editUserTagsId, body))
    } else {
      const userIds = [editUserTagsId]
      const { groupIds } = body
      return dispatch(updateUsersGroups({ userIds, groupIds, isAdmin }))
    }
  }

  handleResendInvite = (userId) => {
    const { resendingInvites } = this.state
    this.setState({ resendingInvites: { ...resendingInvites, [userId]: true } })
    return sendInvitationForUser({ userId })
    .then(() => {
      const { resendingInvites } = this.state
      this.setState({ resendingInvites: omit(resendingInvites, userId) })
    })
  }

  handlePageChange = (page) => {
    const { dispatch } = this.props
    dispatch(resetSelection())
    dispatch(changePage(page))
  }

  handleUsersPerPageChange = (usersPerPage) => {
    const { dispatch } = this.props
    dispatch(resetSelection())
    dispatch(changeRecordsPerPage(usersPerPage))
  }

  componentWillReceiveProps ({ pagination: { pagesNumber, page } }) {
    if (page > pagesNumber) {
      this.props.dispatch(changePage(pagesNumber))
    } else if (page < 1) {
      this.props.dispatch(changePage(1))
    }
  }

  componentWillUnmount () {
    const { dispatch } = this.props
    dispatch(resetSearch())
    dispatch(resetSortColumn())
    dispatch(resetPagination())
    dispatch(resetSelection())
  }

  render () {
    const { currentUserId, users, usersLength, groupsLenth, sortedGroups, activeGroups,
      paginatedUsers, selectedUsers, selected,
      sortColumn, search, pagination,
      existingEmails, existingSlacks,
      isAdmin, isNew, isSmall, currentCompany
    } = this.props
    const { editUserId, editUserTagsId, resendingInvites, importError,
      showDeleteModal, showCreateModal, showTagsModal, showUsersImportModal
    } = this.state

    return (
      <Container>
        <ContainerHeader>
          <TeamHeaderMenu
            groupsSize={groupsLenth}
            usersSize={usersLength}
          />
          <TeamHeaderSearch
            searchTerm={search.term}
            searchFilter={search.filter}
            onSearch={this.handleSearch}
            onSearchFilter={this.handleSearchFilter}
          />
          {isAdmin ? <TeamHeaderCreateUser onCreateUsers={this.onCreateUsers} /> : null}
          <TeamHeaderDropdown
            isAdmin={isAdmin}
            groups={sortedGroups}
            selectedUsers={selectedUsers}
            onTagUsers={this.onTagUsers}
            onDownloadUsers={this.onDownloadUsers}
            onImportUsers={this.onImportUsers}
            onDeleteUsers={this.onDeleteUsers}
            onCreateUsers={this.onCreateUsers}
            onSelectAllUsers={this.handleSelectAllUsers}
          />
        </ContainerHeader>
        <ContainerBody>
          <div>
            <TeamUsersTable
              users={paginatedUsers}
              selected={selected}
              groups={sortedGroups}
              isAdmin={isAdmin}
              currentUserId={currentUserId}
              sortColumn={sortColumn}
              isSmall={isSmall}
              toggleSelectedUsers={this.toggleSelectedUsers}
              onSelectUser={this.onSelectUser}
              onEditUser={this.onEditUser}
              onEditUserTags={this.handleEditUserTags}
              onSortChange={this.handleSortChange}
              onResendInvite={this.handleResendInvite}
              resendingInvites={resendingInvites}
            />
            <TeamUsersPaginator
              pagesNumber={pagination.pagesNumber}
              currentPage={pagination.page}
              recordsPerPage={pagination.recordsPerPage}
              onChange={this.handlePageChange}
              onRecordsPerPageChange={this.handleUsersPerPageChange}
            />
            {isNew ? <TeamUsersImport onImportUsers={this.onImportUsersFile} /> : null}
          </div>
          {showTagsModal ? (
            <TeamTagsModal
              activeGroups={activeGroups}
              amountOfSelectedUsers={selectedUsers.length}
              onTagUsers={this.tagUsers}
              onClose={this.createCloseModal('showTagsModal')}
            />
          ) : null}
          {importError ? (
            <TeamModalError
              message={importError}
              onClose={this.createCloseModal('importError')}
            />
          ) : null}
          {showDeleteModal ? (
            <TeamModalDeleteUsers
              amountOfSelectedUsers={selectedUsers.length}
              onSubmit={this.deleteSelectedUsers}
              onClose={this.createCloseModal('showDeleteModal')}
            />
          ) : null}
          {showUsersImportModal ? (
            <TeamUsersImportModal
              onImportUsersFile={this.onImportUsersFile}
              onClose={this.createCloseModal('showUsersImportModal')} />
          ) : null}
          {showCreateModal ? (
            <TeamForm
              currentCompany={currentCompany}
              activeGroups={activeGroups}
              existingEmails={existingEmails}
              existingSlacks={existingSlacks}
              onSubmit={this.createUser}
              onClose={this.createCloseModal('showCreateModal')}
            />
          ) : null}
          {editUserId ? (
            <TeamForm
              isEdit
              currentCompany={currentCompany}
              user={users[editUserId]}
              activeGroups={activeGroups}
              existingEmails={existingEmails}
              existingSlacks={existingSlacks}
              onSubmit={this.updateUser}
              deleteUser={this.deleteUser}
              onClose={this.createCloseModal('editUserId')}
            />
          ) : null}
          {editUserTagsId ? (
            <TeamUserTagsModal
              user={users[editUserTagsId]}
              isAdmin={isAdmin}
              activeGroups={activeGroups}
              onSubmit={this.handleUpdateUserTags}
              onClose={this.createCloseModal('editUserTagsId')}
            />
          ) : null}
        </ContainerBody>
      </Container>
    )
  }
}

export default connect(mapStateToProps)(TeamUsers)
