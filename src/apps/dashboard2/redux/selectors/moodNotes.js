import { createSelector } from '../../utils/performance'
import Immutable from 'immutable'
import { pickItems } from '../data-utils'
import { getNotesForCurrentUserByBox, getUnreadNotesForCurrentUser } from './notes'
import { getUsers, getCurrentUserPublicGroups, getCurrentUserId,
  getCurrentUser, getCurrentUserManagers, getAdminUsers
} from './users'
import { getMoodBoxes } from './boxes'
import { getCurrentCompanyName } from './company'

const emptyImmutableMap = Immutable.Map()
const emptyArray = []
export const getTempNotes = (state, { boxId }) => state.moodNotes.tempQueue[boxId] || emptyArray

const getBoxId = (_, { boxId }) => boxId
export const getBox = createSelector(
  [getMoodBoxes, getBoxId],
  function getBox (boxes, boxId) { return boxes.get(boxId) }
)

export const getBoxNotesForCurrentUser = createSelector(
  [getNotesForCurrentUserByBox, getBoxId],
  function getBoxNotesForCurrentUser (notesByBox, boxId) {
    return (notesByBox.get(boxId) || emptyImmutableMap).sortBy(note => note.createdAt)
  }
)

export const getMappedBoxNotesForCurrentUser = createSelector(
  [getBoxNotesForCurrentUser, getUnreadNotesForCurrentUser,
  getUsers, getCurrentUserId, getCurrentUserPublicGroups, getCurrentCompanyName],
  function getMappedBoxNotesForCurrentUser (notes, unreadNotes, users, currentUserId, groups, companyName) {
    const noteMapper = (note) => {
      const { _id, body, createdAt, managerId, groupIds, allCompany } = note
      const isSeen = !unreadNotes.get(_id)
      const isPrivate = !(allCompany || groupIds && groupIds.size !== 0)
      const groupIdsList = groupIds.toArray()
      const tags = allCompany ? [companyName] : pickItems(groups, groupIdsList).map(group => group.name).toArray()
      return ({
        _id,
        body,
        createdAt,
        groupIds: groupIdsList,
        tags,
        manager: users.get(managerId),
        isPrivate,
        allCompany,
        isSeen
      })
    }
    return notes.map(noteMapper).toArray()
  }
)

export const getFirstUnreadBoxNoteIndex = createSelector(
  [getMappedBoxNotesForCurrentUser],
  function getFirstUnreadBoxNoteIndex (notes) { return notes.findIndex(({ isSeen }) => !isSeen) }
)

export const getCurrentUserPublicGroupsWithManagers = createSelector(
  [getCurrentUserPublicGroups, getCurrentUserManagers, getAdminUsers],
  function getCurrentUserPublicGroupsWithManagers (groups, managers, admins) {
    return groups.map(group => {
      const groupManagers = managers.filter(manager =>
        manager._id === group.managerId || manager.hasAccessOnly.includes(group._id)
      ).toArray()
      const groupManagersWithAdmins = admins.toArray().concat(groupManagers)
      return { ...group.toJS(), managers: groupManagersWithAdmins }
    })
  }
)

export const getNotesQueue = createSelector(
  [getTempNotes, getCurrentUser],
  function getNotesQueue (tempNotes, currentUser) {
    return tempNotes.map(tempNote => ({
      ...tempNote,
      inQueue: true,
      isPrivate: true,
      tags: [],
      manager: currentUser
    }))
  }
)
