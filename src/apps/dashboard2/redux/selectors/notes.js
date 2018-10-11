import { createSelector } from '../../utils/performance'
import { intersection } from 'lodash'
import { getCurrentUserActiveGroupIds, getCurrentUserId, getCurrentUserRole } from './users'
import { getMoodBoxes } from './boxes'

export const getNotes = state => state.notes
export const getNotesForCurrentUser = createSelector(
  [getNotes, getCurrentUserId, getCurrentUserActiveGroupIds, getCurrentUserRole],
  function getNotesForCurrentUser (notes, currentUserId, currentUserGroups) {
    return notes.filter(note => {
      const groups = note.groupIds.toJS()
      return note.managerId === currentUserId ||
        note.allCompany ||
        intersection(groups, currentUserGroups).length !== 0
    })
  }
)

export const getNotesForCurrentUserByBox = createSelector(
  [getNotesForCurrentUser],
  function getNotesForCurrentUserByBox (notes) { return notes.groupBy(r => r.boxId) }
)

export const getUnreadNotesForCurrentUserByBox = createSelector(
  [getNotesForCurrentUserByBox, getCurrentUserId, getMoodBoxes],
  function getUnreadNotesForCurrentUserByBox (notesByBox, currentUserId, moodBoxes) {
    return notesByBox.map(notes => {
      return notes.filter(note => {
        const box = moodBoxes.get(note.boxId)
        const seenDate = box.seenNotesAt ? box.seenNotesAt.get(currentUserId) : null
        return note.managerId !== currentUserId && (!seenDate || note.createdAt > seenDate)
      })
    })
  }
)
export const getUnreadNotesForCurrentUser = createSelector(
  getUnreadNotesForCurrentUserByBox,
  function getUnreadNotesForCurrentUser (unreadNotesByBox) { return unreadNotesByBox.flatten(1) }
)

export const getUnreadNotesNumber = createSelector(
  getUnreadNotesForCurrentUser,
  function getUnreadNotesNumber (unreadNotes) { return unreadNotes.size }
)
