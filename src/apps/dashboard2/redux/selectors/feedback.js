import { createSelector } from '../../utils/performance'
import Immutable from 'immutable'
import {
  getChatForReplyAndUser, filterUnreadMessages,
  filterUnread,
  getMessagesForChat,
  filterMessagesForRepliesAndUser,
  filterQuestionsByGroupIds, filterRepliesByGroupIds
} from '../../redux/data-utils'
import { formatDateTime } from '../../utils/moment'
import { countStars, countSmileys, countVibe, getAverageStars,
         getAverageSmileys, getAverageVibe } from '../../views/Feedback/feedback-utils'
import { getBoxType } from '../../../../utils/replies-utils'
import { getCurrentUser, getUsers } from './users'
import { getFeedbackBoxes } from './boxes'
import { getRepliesByBox, getUnreadRepliesByBox } from './replies'
import { getMessagesByChat, getMessages } from './messages'
import { getGroups } from './groups'

const emptyImmutableMap = new Immutable.Map()
const getChats = state => state.chats

export const geedUnreadFeedbackNumber = createSelector(
  [getFeedbackBoxes, getRepliesByBox, getUnreadRepliesByBox, getChats, getCurrentUser, getMessagesByChat],
  function geedUnreadFeedbackNumber (feedbackBoxes, repliesByBox, unreadRepliesByBox,
    chats, currentUser, messagesByChat) {
    let unreadFeedback = 0
    feedbackBoxes.forEach(box => {
      const boxReplies = repliesByBox.get(box._id) || emptyImmutableMap
      unreadFeedback += (unreadRepliesByBox.get(box._id) || emptyImmutableMap).size
      boxReplies.forEach((reply) => {
        const chat = getChatForReplyAndUser(chats, reply, currentUser)
        if (chat) unreadFeedback += filterUnreadMessages(messagesByChat.get(chat._id) || []).size
      })
    })
    return unreadFeedback
  }
)

export const getSelectedBoxId = createSelector(
  [(_state, { boxId }) => boxId, getFeedbackBoxes],
  function getSelectedBoxId (boxId, boxes) {
    const box = boxes.get(boxId) || boxes.first()
    return box ? box._id : null
  }
)

export const getSelectedBox = createSelector(
  [getSelectedBoxId, getFeedbackBoxes],
  function getSelectedBox (boxId, boxes) { return boxes.get(boxId) }
)

export const getSelectedGroup = createSelector(
  [(_state, { groupId }) => groupId, getGroups],
  function getSelectedGroup (groupId, groups) { return groups.get(groupId) }
)

const isComment = (r) => r.body || r.polls.some(p => p.body)

export const getTransformedBoxes = createSelector(
  [getSelectedGroup, getCurrentUser, getFeedbackBoxes, getRepliesByBox, getMessages, getChats],
  function getTransformedBoxes (group, currentUser, boxes, repliesByBox, messages, chats) {
    return boxes.map(box => {
      const allQuestions = box.questions.map((q) => q.toObject())
      const boxQuestions = !group ? allQuestions : filterQuestionsByGroupIds(allQuestions, [group._id])
      const allReplies = repliesByBox.get(box._id) || new Immutable.Map()
      const boxReplies = !group ? allReplies : filterRepliesByGroupIds(boxQuestions, allReplies, [group._id])
      const boxMessages = filterMessagesForRepliesAndUser(messages, chats, boxReplies.toArray(), currentUser)
      const unreadRepliesAndComments = filterUnread(allReplies)
      const unreadMessages = filterUnreadMessages(boxMessages)
      const type = getBoxType(box)
      let polls
      if (type === 'polls') {
        polls = box.polls.toArray().map((poll, pollIndex) => {
          const pollType = poll.get('type')
          const smileys = pollType !== 'smileys' ? [] : countSmileys(boxReplies, { pollIndex })
          const stars = pollType !== 'rating' ? [] : countStars(boxReplies, { pollIndex })
          const vibe = pollType !== 'yesno' ? [] : countVibe(boxReplies, { pollIndex })
          return {
            text: poll.get('text'),
            type: pollType,
            imageUrl: poll.get('imageUrl'),
            report: {
              stars,
              smileys,
              vibe,
              averageStars: stars.length ? getAverageStars(stars) : null,
              averageSmileys: smileys.length ? getAverageSmileys(smileys) : null,
              averageVibe: vibe.length ? getAverageVibe(vibe) : null
            }
          }
        })
      } else {
        const smileys = type !== 'smileys' ? [] : countSmileys(boxReplies)
        const stars = type !== 'rating' ? [] : countStars(boxReplies)
        const vibe = type !== 'yesno' ? [] : countVibe(boxReplies)
        polls = [{
          text: box.name,
          type,
          imageUrl: box.imageUrl,
          report: {
            stars,
            smileys,
            vibe,
            averageStars: stars.length ? getAverageStars(stars) : null,
            averageSmileys: smileys.length ? getAverageSmileys(smileys) : null,
            averageVibe: vibe.length ? getAverageVibe(vibe) : null
          }
        }]
      }
      return {
        _id: box._id,
        date: formatDateTime(box.scheduledAt || box.createdAt),
        resendedAt: box.resendedAt,
        scheduledAt: box.scheduledAt,
        type,
        polls,
        isAll: box.display.includes('all'),
        isAnonymous: box.display.includes('anonymous'),
        isUnread: Boolean(unreadRepliesAndComments.size + unreadMessages.size),
        isDisabled: box.status === 'disabled',
        isScheduled: box.scheduledAt - Date.now() > 0,
        totalQuestions: boxQuestions.size,
        totalReplies: boxReplies.size,
        participation: Math.round(100 * boxReplies.size / boxQuestions.size),
        allQuestions,
        allReplies,
        questions: boxQuestions,
        replies: boxReplies,
        messages: boxMessages,
        unreadReplies: unreadRepliesAndComments.filter((r) => !isComment(r)).toArray(),
        unreadComments: unreadRepliesAndComments.filter((r) => isComment(r)).toArray(),
        unreadMessages: unreadMessages.toArray()
      }
    })
  }
)

export const getTransformedBoxesList = createSelector(
  getTransformedBoxes, function getTransformedBoxesList (boxes) { return boxes.toArray() }
)

export const getTransformedSelectedBox = createSelector(
  [getSelectedBoxId, getTransformedBoxes],
  function getTransformedSelectedBox (selectedBoxId, transformedBoxes) {
    return transformedBoxes.get(selectedBoxId)
  }
)

export const getCommentsListForSelectedBox = createSelector(
  [getTransformedSelectedBox, getCurrentUser, getUsers, getChats],
  function getCommentsListForSelectedBox (box, currentUser, users, chats) {
    return box.replies.filter((r) => isComment(r)).sortBy((r) => -r.createdAt)
    .map(reply => {
      const user = users.get(reply.userId)
      const chat = getChatForReplyAndUser(chats, reply, currentUser)
      const chatMessages = getMessagesForChat(box.messages, chat)
      return {
        _id: reply._id,
        body: reply.body,
        reply,
        userName: user ? user.fullName : null,
        createdAt: reply.createdAt,
        isUnread: filterUnreadMessages(chatMessages).size,
        messagesCount: chatMessages.size
      }
    }).toArray()
  }
)

export const getGroupsListForSelectedBox = createSelector(
  [getSelectedBox, getGroups],
  function getGroupsListForSelectedBox (selectedBox, groups) {
    return selectedBox.groupIds
    .map(_id => ({ _id, name: groups.get(_id).name }))
    .toArray()
  }
)
