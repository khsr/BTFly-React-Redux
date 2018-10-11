import { createSelector } from '../../utils/performance'
import { getCurrentUser, getCurrentUserActiveGroups, getCurrentUserUsers, getCurrentUserManagers } from './users'
import { filterUsersByGroup, filterManagersByGroup, exclude } from '../../redux/data-utils'

export const getMappedGroups = createSelector(
  [getCurrentUserUsers, getCurrentUserManagers, getCurrentUserActiveGroups, getCurrentUser],
  function getMappedGroups (users, managers, groups, currentUser) {
    return groups.map(g => {
      const { isAdmin } = currentUser
      const groupUsers = exclude(filterUsersByGroup(users, g), currentUser).sort((u1, u2) => {
        if (u1.fullName < u2.fullName) return -1
        if (u1.fullName > u2.fullName) return 1
        return 0
      })
      const managersInTheGroup = filterManagersByGroup(managers, g)
      return {
        _id: g._id,
        name: g.name,
        managerId: g.managerId,
        moodTracking: g.moodTracking,
        instantFeedback: g.instantFeedback,
        users: groupUsers.toArray(),
        usersCount: groupUsers.size,
        managers: managersInTheGroup.toArray(),
        managersCount: managersInTheGroup.size,
        includesYou: currentUser.groupIds.includes(g._id),
        isDisabled: !isAdmin && g.managerId !== currentUser._id,
        isInactive: groupUsers.size < 4
      }
    }).toObject()
  }
)

export const getGroupsLength = createSelector(
  [getCurrentUserActiveGroups],
  function getGroupsLength (groups) { return groups.size }
)

export const getUsersLength = createSelector(
  [getCurrentUserUsers],
  function getUsersLength (users) { return users.size }
)
