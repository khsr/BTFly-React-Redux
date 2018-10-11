import { createSelector } from '../../utils/performance'
import Immutable from 'immutable'
import moment from '../../utils/moment'
import { groupBy, values, chunk, uniq, flatten } from 'lodash'
import { ZOOM_OPTIONS } from '../../config'
import {
  getBoxQuestionsForUser, filterRepliesByGroupIds, getUnreadComments,
  filterComments, getChatForReplyAndUser, filterUnreadMessages,
  filterQuestionsByGroupIds, filterRepliesByQuestions, filterMessagesForRepliesAndUser,
  getButterflyIndex, getMoodDrivers,
  filterGroupsByUser, filterZoomOptionsByMoodSettings
} from '../data-utils'
import { namespace } from '../../../../utils/locales'
import { getMoodBoxes, getMoodBoxesList, getQuestionsByBox } from './boxes'
import { getUsers, getCurrentUser, getCurrentUserGroups, getCurrentUserPossibleGroups } from './users'
import { getRepliesByBox, getUnreadRepliesByBox } from './replies'
import { getMessages, getMessagesByChat } from './messages'
import { getNotesForCurrentUserByBox, getUnreadNotesForCurrentUserByBox } from './notes'
import { getGroups } from './groups'
import { getCurrentCompany } from './company'

export const yourTeam = { _id: 'yourteam', name: namespace('dashboard.mood')('report-your-teams') }
export const emptyBox = {
  _id: '-',
  drivers: null,
  allReplies: [],
  allQuestions: [],
  replies: [],
  driversReplies: [],
  questions: [],
  comments: [],
  unreadComments: [],
  unreadMessages: [],
  status: [],
  moodSharedAt: []
}

const emptyImmutableMap = new Immutable.Map()
const getChats = state => state.chats

function filterMoodDetails (replies) {
  return replies.filter((r) => {
    return r.moodDetails && Object.keys(r.moodDetails).length
  })
}

function filterBoxGroups (boxGroupsIds, isSelectedGroupValid, selectedGroupId, currentUser, groups, possibleGroups) {
  if (!isSelectedGroupValid) return null
  let curentGroupIds = null
  if (boxGroupsIds && boxGroupsIds.size) {
    const activeChunkGroups = boxGroupsIds.map(gId => groups.get(gId)).filter((g) => g)
    curentGroupIds = filterGroupsByUser(activeChunkGroups, currentUser).map(g => g._id).toArray()
  } else {
    curentGroupIds = possibleGroups.map(g => g._id).toArray()
  }
  return selectedGroupId === yourTeam._id ? curentGroupIds : [selectedGroupId]
}

export const getUnreadMoodCommentsNumber = createSelector(
  [getMoodBoxes, getCurrentUser, getRepliesByBox, getUnreadRepliesByBox,
  getCurrentUserGroups, getChats, getMessagesByChat],
  function getUnreadMoodCommentsNumber (moodBoxes, currentUser, repliesByBox,
    getUnreadRepliesByBox, userGroups, chats, messagesByChat) {
    let unreadMoodComments = 0
    moodBoxes.forEach((box) => {
      const boxQuestions = getBoxQuestionsForUser(box, currentUser)
      const boxReplies = (repliesByBox.get(box._id) || emptyImmutableMap).toArray()
      const relatedReplies = currentUser.isAdmin
      ? boxReplies
      : filterRepliesByGroupIds(boxQuestions, boxReplies, userGroups.map((g) => g._id))
      unreadMoodComments += getUnreadComments(filterComments(relatedReplies), box, currentUser).length
      relatedReplies.forEach((reply) => {
        const chat = getChatForReplyAndUser(chats, reply, currentUser)
        if (chat) unreadMoodComments += filterUnreadMessages(messagesByChat.get(chat._id) || []).size
      })
    })
    return unreadMoodComments
  }
)

export const getZoomOptions = createSelector(
  [getCurrentCompany],
  function getZoomOptions (company) {
    return filterZoomOptionsByMoodSettings(ZOOM_OPTIONS, company.moodSettings)
  }
)

export const getZoom = createSelector(
  [state => state.mood.zoom, getZoomOptions],
  function getZoom (zoom, zoomOptions) {
    if (!zoomOptions.includes(zoom)) return zoomOptions[0]
    return zoom
  }
)

export const getBoxesIds = createSelector(
  [getMoodBoxesList],
  function getBoxesIds (boxes) { return boxes.map(box => box._id) }
)

export const getSelectedBoxId = createSelector(
  [(_state, { boxId }) => boxId, getBoxesIds],
  function getSelectedBoxId (boxId, boxesIds) {
    if (boxId && boxesIds.includes(boxId)) {
      return boxId
    } else {
      return boxesIds[boxesIds.length - 1]
    }
  }
)

export const getChunkedBoxes = createSelector(
  [getMoodBoxesList, getZoom],
  function getChunkedBoxes (moodBoxes, zoom) {
    switch (zoom) {
      case '1week':
      case '2weeks': {
        const groupByWeek = values(groupBy(moodBoxes, box => moment(box.createdAt).startOf('week')))
        if (zoom === '2weeks') return chunk(groupByWeek, 2).map(chunk => flatten(chunk))
        return groupByWeek
      }
      case '1month':
      case '2months':
      case '6months': {
        const groupByMonth = values(groupBy(moodBoxes, box => moment(box.createdAt).startOf('month')))
        if (zoom === '2months') return chunk(groupByMonth, 2).map(chunk => flatten(chunk))
        if (zoom === '6months') return chunk(groupByMonth, 6).map(chunk => flatten(chunk))
        return groupByMonth
      }
      case '1year': return values(groupBy(moodBoxes, box => moment(box.createdAt).startOf('year')))
      default: {
        return chunk(moodBoxes, 1)
      }
    }
  }
)

export const getSelectedMergedBoxIndex = createSelector(
  [getChunkedBoxes, getSelectedBoxId],
  function getSelectedMergedBoxIndex (chunkedBoxes, boxId) {
    const index = chunkedBoxes.findIndex(chunk => chunk.some(b => b._id === boxId))
    return index !== -1 ? index : chunkedBoxes.length - 1
  }
)

export const getActiveChunk = createSelector(
  [getChunkedBoxes, getSelectedMergedBoxIndex],
  function getActiveChunk (chunkedBoxes, activeChunkIndex) {
    return chunkedBoxes[activeChunkIndex] || []
  }
)

export const getActiveChunkGroupIds = createSelector(
  [getActiveChunk],
  function getActiveChunkGroupIds (activeChunk) {
    return new Immutable.List(uniq(flatten(activeChunk.map(box => box.groupIds.toArray()))))
  }
)

export const getCurrentGroups = createSelector(
  [getActiveChunkGroupIds, getGroups, getCurrentUser, getCurrentUserPossibleGroups],
  function getCurrentGroups (activeChunkGroupIds, groups, currentUser, currentUserPossibleGroups) {
    if (activeChunkGroupIds.size && activeChunkGroupIds) {
      const activeChunkGroups = activeChunkGroupIds.map(gId => groups.get(gId)).filter((g) => g)
      return filterGroupsByUser(activeChunkGroups, currentUser)
    } else {
      return currentUserPossibleGroups
    }
  }
)

export const getSelectedGroupId = (_state, { groupId }) => groupId

export const getIsSelectedGroupValid = createSelector(
  [getSelectedGroupId, getCurrentUser, getGroups],
  function getIsSelectedGroupValid (selectedGroupId, currentUser, groups) {
    return selectedGroupId === yourTeam._id && currentUser.isManager || Boolean(groups.get(selectedGroupId))
  }
)

export const getSelectedGroup = createSelector(
  [getSelectedGroupId, getIsSelectedGroupValid, getGroups],
  function getSelectedGroup (selectedGroupId, isSelectedGroupValid, groups) {
    if (!isSelectedGroupValid) return null
    return selectedGroupId === yourTeam._id ? yourTeam : groups.get(selectedGroupId)
  }
)

export const getMergedBoxes = createSelector(
  [
    getChunkedBoxes, getCurrentUser, getRepliesByBox, getQuestionsByBox, getUsers,
    getNotesForCurrentUserByBox, getUnreadNotesForCurrentUserByBox,
    getIsSelectedGroupValid, getSelectedGroupId, getGroups, getCurrentUserPossibleGroups
  ],
  function getMergedBoxes (chunkedBoxes, currentUser, repliesByBox, questionsByBox, users, notesByBox, unreadNotesByBox,
    isSelectedGroupValid, selectedGroupId, groups, possibleGroups) {
    return chunkedBoxes.map(chunk => {
      const reduceList = (list) => list.reduce((mem, val) => mem.concat(val), [])
      const allChunkQuestions = reduceList(chunk.map(box => questionsByBox.get(box._id) || []))
      const allChunkReplies = reduceList(chunk.map(box => {
        return (repliesByBox.get(box._id) || new Immutable.Map())
        .sortBy((r) => -r.createdAt)
        .toArray()
      }))

      const chunkGroups = new Immutable.List(uniq(flatten(chunk.map(box => box.groupIds.toArray()))))
      const groupIds = filterBoxGroups(chunkGroups, isSelectedGroupValid, selectedGroupId, currentUser, groups, possibleGroups)

      const chunkQuestions = !groupIds ? allChunkQuestions : filterQuestionsByGroupIds(allChunkQuestions, groupIds)
      const chunkReplies = !groupIds ? allChunkReplies : filterRepliesByQuestions(chunkQuestions, allChunkReplies)
      const chunkDriversReplies = filterMoodDetails(chunkReplies)

      const notes = reduceList(chunk.map(box => (notesByBox.get(box._id) || new Immutable.Map()).toArray()))
      const unreadNotes = reduceList(chunk.map(box => (unreadNotesByBox.get(box._id) || new Immutable.Map()).toArray()))
      return {
        _id: chunk[chunk.length - 1]._id,
        boxIds: chunk.map(box => box._id),
        createdAt: chunk.map(box => box.createdAt),
        moodSharedAt: chunk.map(box => box.moodSharedAt),
        status: chunk.map(box => box.status),
        bfIndex: getButterflyIndex(chunkReplies),
        drivers: getMoodDrivers(chunkDriversReplies),
        questions: chunkQuestions,
        allQuestions: allChunkQuestions,
        replies: chunkReplies,
        driversReplies: chunkDriversReplies,
        allReplies: allChunkReplies,
        notes,
        unreadNotes
      }
    })
  }
)

export const getSelectedMergedBox = createSelector(
  [getSelectedMergedBoxIndex, getMergedBoxes],
  function getSelectedMergedBox (selectedMergedBoxIndex, mergedBoxes) {
    return mergedBoxes[selectedMergedBoxIndex]
  }
)

export const getBoxes = createSelector(
  [
    getMoodBoxesList, getCurrentUser, getRepliesByBox, getQuestionsByBox, getChats,
    getMessages, getUsers, getCurrentUserPossibleGroups
  ],
  function getBoxes (boxes, currentUser, repliesByBox, questionsByBox, chats, messages,
    users, currentUserPossibleGroups) {
    const groupIds = currentUserPossibleGroups.map(g => g._id).toArray()
    return boxes.map(box => {
      const allBoxQuestions = questionsByBox.get(box._id) || []
      const allBoxReplies = (repliesByBox.get(box._id) || new Immutable.Map())
        .sortBy((r) => -r.createdAt)
        .toArray()

      const chunkQuestions = !groupIds ? allBoxQuestions : filterQuestionsByGroupIds(allBoxQuestions, groupIds)
      const chunkReplies = !groupIds ? allBoxReplies : filterRepliesByQuestions(chunkQuestions, allBoxReplies)
      const chunkDriversReplies = filterMoodDetails(chunkReplies)
      const userRelatedReplies = currentUser.isAdmin ? allBoxReplies : filterRepliesByGroupIds(allBoxQuestions, allBoxReplies, groupIds)

      const comments = filterComments(userRelatedReplies)
      const allChunkMessages = filterMessagesForRepliesAndUser(messages, chats, allBoxReplies, currentUser).toArray()
      const allChats = chats.filter(c => allBoxReplies.some(r => c.replyId === r._id)).toArray().map((c) => {
        const manager = users.get(c.managerId)
        return {
          ...c.toObject(),
          managerPicture: manager && manager.picture,
          managerName: manager && manager.fullName
        }
      })

      const unreadComments = getUnreadComments(comments, box, currentUser)
      const unreadMessages = filterUnreadMessages(allChunkMessages)
      return {
        _id: box._id,
        createdAt: box.createdAt,
        status: box.status,
        bfIndex: getButterflyIndex(chunkReplies),
        drivers: getMoodDrivers(chunkDriversReplies),
        questions: chunkQuestions,
        allQuestions: allBoxQuestions,
        replies: chunkReplies,
        driversReplies: chunkDriversReplies,
        allReplies: allBoxReplies,
        comments,
        unreadComments,
        allChats,
        allMessages: allChunkMessages,
        unreadMessages
      }
    })
  }
)

export const getSelectedBox = createSelector(
  [getSelectedBoxId, getBoxes],
  function getSelectedBox (selectedBoxId, boxes) { return boxes.find(box => box._id === selectedBoxId) }
)
