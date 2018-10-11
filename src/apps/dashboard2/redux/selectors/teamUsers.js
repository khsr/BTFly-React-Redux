import { createSelector } from '../../utils/performance'
import { values } from 'lodash'
import { getCurrentUserActiveGroups, getCurrentUserUsers } from './users'
import { getMappedGroups } from './team'
import { pickItems } from '../../redux/data-utils'

export const getSearch = state => state.teamUsers.search
export const getLatestUploadUsers = state => state.teamUsers.latestUpload
export const getSortColumn = state => state.teamUsers.sort
export const getPaginationParams = state => state.teamUsers.pagination
export const getUsersSelection = state => state.teamUsers.selection

export const getCleanSearchTerm = createSelector(
  [getSearch],
  function getCleanSearchTerm ({ term }) {
    return term.toLowerCase().split('+').map(value => value.trim()).filter(value => !!value).join('+')
  }
)

export const getFilter = createSelector(
  [getSearch],
  function getFilter ({ filter }) { return filter }
)

export const getMappedUsers = createSelector(
  [getCurrentUserUsers, getCurrentUserActiveGroups],
  function getMappedUsers (users, groups) {
    return users.map(u => {
      const groupIds = u.groupIds.filter(gId => groups.get(gId)).toArray()
      const hasAccessOnly = u.hasAccessOnly.toArray()
      const tags = pickItems(groups, groupIds.concat(hasAccessOnly)).map(group => group.name).toArray()
      return ({
        _id: u._id,
        email: u.email,
        slack: u.slack,
        preferred: u.preferred,
        fullName: u.fullName,
        updatedAt: u.updatedAt || u.createdAt,
        role: u.role,
        groupIds,
        tags,
        alreadyLoggedIn: u.alreadyLoggedIn,
        hasAccessOnly
      })
    }).toObject()
  }
)

export const getMappedUsersList = createSelector(
  [getMappedUsers],
  function getMappedUsersList (mappedUsers) { return values(mappedUsers) }
)

export const getFilteredUsers = createSelector(
  [getMappedUsersList, getLatestUploadUsers, getFilter, getCleanSearchTerm],
  function getFilteredUsers (users, latestUploadUsers, filter, term) {
    const terms = term.split('+')
    return users.filter(u => {
      if (filter === 'no-tags' && u.groupIds.length) return false
      if (filter === 'admins' && u.role !== 'admin') return false
      if (filter === 'managers' && u.role !== 'manager') return false
      if (filter === 'users' && u.role !== 'user') return false
      if (filter === 'latest-upload' && !latestUploadUsers[u._id]) return false
      if (!terms.length) return true

      const termsMatching = terms.map(term =>
        u.email.toLowerCase().includes(term) ||
        u.fullName.toLowerCase().includes(term) ||
        u.role.toLowerCase().includes(term) ||
        u.tags.some(tag => tag.toLowerCase().includes(term))
      )
      return termsMatching.every(match => match === true)
    })
  }
)

export const getExistingEmails = createSelector(
  [getMappedUsersList],
  function getExistingEmails (users) { return users.map(u => u.email) } // email is always exist
)

export const getExistingSlacks = createSelector(
  [getMappedUsersList],
  function getExistingSlacks (users) { return users.filter(u => u.slack).map(u => u.slack) }
)

export const getSortedUsers = createSelector(
  [getFilteredUsers, getSortColumn],
  function getSortedUsers (users, column) {
    return users.slice(0).sort((u1, u2) => {
      if (u1[column] < u2[column]) return -1
      if (u1[column] > u2[column]) return 1
      return 0
    })
  }
)

export const getSortedGroups = createSelector(
  [getMappedGroups],
  function getSortedGroups (groups) {
    return values(groups).sort((g1, g2) => {
      if (g1.managerId && !g2.managerId) return 1
      if (!g1.managerId && g2.managerId) return -1
      if (g1.name < g2.name) return -1
      if (g1.name > g2.name) return 1
      return 0
    })
  }
)

export const getActiveGroups = createSelector(
  [getSortedGroups],
  function getActiveGroups (groups) { return groups.filter(g => !g.isDisabled) }
)

export const getPagesNumber = createSelector(
  [getFilteredUsers, getPaginationParams],
  function getPagesNumber (users, { recordsPerPage }) {
    return Math.ceil(Object.keys(users).length * 1.0 / recordsPerPage) || 1
  }
)

export const getPagination = createSelector(
  [getPagesNumber, getPaginationParams],
  function getPagination (pagesNumber, paginationParams) { return { ...paginationParams, pagesNumber } }
)

export const getPaginatedUsers = createSelector(
  [getSortedUsers, getPaginationParams],
  function getPaginatedUsers (users, { page, recordsPerPage }) {
    return users.slice(recordsPerPage * (page - 1), recordsPerPage * page)
  }
)

export const getSelectedUsers = createSelector(
  [getMappedUsers, getUsersSelection],
  function getSelectedUsers (users, selected) { return Object.keys(selected).map(userId => users[userId]) }
)
