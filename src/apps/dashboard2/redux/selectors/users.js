import { createSelector } from '../../utils/performance'
import { filterActive, filterGroupsByUser, filterUsersForCurrentUser,
         filterUsersByRole, getPossibleGroups } from '../../redux/data-utils'
import { getGroups, getActiveGroups } from './groups'

export const getCurrentUser = state => state.currentUser
export const getUsers = state => state.users

export const getNotDeletedUsers = createSelector(
  [getUsers],
  function getNotDeletedUsers (users) { return filterActive(users) }
)

export const getCurrentUserId = createSelector(
  [getCurrentUser],
  function getCurrentUserId (currentUser) { return currentUser.get('_id') }
)

export const getCurrentUserRole = createSelector(
  [getCurrentUser],
  function getCurrentUserRole (currentUser) { return currentUser.get('role') }
)

export const getAdminUsers = createSelector(
  [getUsers],
  function getAdminUsers (users) { return filterUsersByRole(users, 'admin') }
)

export const getCurrentUserGroups = createSelector(
  [getGroups, getCurrentUser],
  function getCurrentUserGroups (groups, currentUser) { return filterGroupsByUser(groups, currentUser) }
)

export const getCurrentUserActiveGroups = createSelector(
  [getActiveGroups, getCurrentUser],
  function getCurrentUserActiveGroups (groups, currentUser) { return filterGroupsByUser(groups, currentUser) }
)

export const getCurrentUserActiveGroupIds = createSelector(
  [getCurrentUserActiveGroups],
  function getCurrentUserActiveGroupIds (groups) { return Object.keys(groups.toJS()) }
)

export const getCurrentUserUsers = createSelector(
  [getNotDeletedUsers, getCurrentUserActiveGroups, getCurrentUser],
  function getCurrentUserUsers (users, groups, currentUser) {
    return filterUsersForCurrentUser(users, groups, currentUser)
  }
)

export const getCurrentUserManagers = createSelector(
  [getCurrentUserUsers],
  function getCurrentUserManagers (users) { return filterUsersByRole(users, 'manager') }
)

export const getCurrentUserPublicGroups = createSelector(
  [getCurrentUserActiveGroups],
  function getCurrentUserPublicGroups (groups) { return groups.filter(group => !group.managerId) }
)

export const getAdminEmail = createSelector(
  [getAdminUsers],
  function getAdminEmail (admins) { return admins.first().email }
)

export const getCurrentUserPossibleGroups = createSelector(
  [getGroups, getUsers, getCurrentUser],
  function getCurrentUserPossibleGroups (groups, users, currentUser) {
    return getPossibleGroups(groups, users, currentUser)
  }
)
