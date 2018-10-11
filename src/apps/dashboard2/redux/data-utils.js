import Immutable from 'immutable'
import { round } from 'lodash'

/**
 * Filter undeleted items.
 *
 * @param {Immutable.Map} items
 * @return {Immutable.Map}
 */

export function filterActive (items) {
  return items.filter((i) => !i.deletedAt)
}

/**
 * Exclude `excludeItem` from `items`.
 *
 * @param {Immutable.Map} items
 * @param {Immutable.Record} excludeItem
 * @return {Immutable.Map}
 */

export function exclude (items, excludeItem) {
  return items.filter((item) => item._id !== excludeItem._id)
}

/**
 * Select `keys` from `items`.
 *
 * @param {Immutable.Map} items
 * @param {Array} keys
 * @return {Immutable.Map}
 */

export function pickItems (items, keys) {
  var keySet = Immutable.Set(keys)
  const prdeicate = (v, k) => keySet.has(k)
  return items.filter(prdeicate)
}

/**
 * Filter users by group.
 *
 * @param {Immutable.Map} users
 * @param {Immutable.Record} group
 * @return {Immutable.Map}
 */

export function filterUsersByGroup (users, group) {
  return users.filter((u) => u.groupIds.includes(group._id))
}

/**
 * Filter users by role.
 *
 * @param {Immutable.Map} users
 * @param {String} role
 * @return {Immutable.Map}
 */

export function filterUsersByRole (users, role) {
  return users.filter((u) => u.role === role)
}

/**
 * Filter managers by group using `hasAccessOnly`.
 *
 * @param {Immutable.Map} users
 * @param {Immutable.Record} group
 * @return {Immutable.Map}
 */

export function filterManagersByGroup (managers, group) {
  return managers.filter((m) => m.hasAccessOnly.includes(group._id))
}

/**
 * Filter admins/managers groups.
 *
 * @param {Immutable.Map} groups
 * @param {Immutable.Record} currentUser
 * @return {Immutable.Map}
 */

export function filterGroupsByUser (groups, currentUser) {
  const { _id, isAdmin, hasAccessOnly } = currentUser
  return groups.filter((g) => {
    return (isAdmin && !g.managerId) ||
           (hasAccessOnly.includes(g._id) || g.managerId === _id)
  })
}

/**
 * Filter users by groups.
 *
 * @param {Immutable.Map} users
 * @param {Immutable.Map} groups
 * @return {Immutable.Map}
 */

export function filterUsersByGroups (users, groups) {
  const availableGroupIds = groups.map((g) => g._id).toArray()
  return users.filter((u) => {
    return u.groupIds.some((gId) => availableGroupIds.includes(gId))
  })
}

/**
 * Filter `users` for `currentUser`.
 *
 * @param {Immutable.Map} users
 * @param {Immutable.Map} groups
 * @param {Immutable.Record} currentUser
 * @return {Immutable.Map}
 */

export function filterUsersForCurrentUser (users, groups, currentUser) {
  const { _id, isAdmin, hasAccessOnly } = currentUser
  const availableGroupIds = isAdmin ? groups.map((g) => g._id).toArray() : hasAccessOnly
  return users.filter((u) => {
    const groupIds = u.groupIds.filter((gId) => groups.get(gId) && !groups.get(gId).deletedAt)
    return (isAdmin && groupIds.size === 0) ||
           (groupIds.some((gId) => availableGroupIds.includes(gId))) ||
           (_id === u._id)
  })
}

/**
 * Find random admin from 'users'
 *
 * @param {Immutable.Map} users
 * @param {Immutable.Record}
 */

export function findAdmin (users) {
  return users.find((user) => user.isAdmin)
}

/**
 * Filter user's notifications.
 *
 * @param {Immutable.Map} notifications
 * @param {Immutable.Record} currentUser
 * @return {Immutable.Map}
 */

export function filterNotifications (notifications, currentUser) {
  return notifications.filter((n) => {
    return currentUser.createdAt < n.createdAt && n.userId !== currentUser._id && (n.isFeedback || n.isMood)
  })
}

/**
 * Filter `items` with `status` not equal "read".
 *
 * @param {Immutable.Map} items
 * @return {Immutable.Map}
 */

export function filterUnread (items) {
  return items.filter((item) => item.status !== 'read')
}

/**
 * Filter `items` with `status` not equal "read".
 *
 * @param {Immutable.Map} items
 * @return {Immutable.Map}
 */

export function filterUnreadMessages (messages) {
  return filterUnread(messages).filter((message) => message.senderIndex === 1)
}

/**
 * Find chat for `reply`.
 *
 * @param {Immutable.Map} chats
 * @param {Immutable.Record} reply
 * @param {Immutable.Record} currentUser
 * @return {Immutable.Record}
 */

export function getChatForReplyAndUser (chats, reply, currentUser) {
  return chats.find((chat) => chat.replyId === reply._id && chat.managerId === currentUser._id)
}

/**
 * Find all `chat` messages.
 *
 * @param {Immutable.Map} chats
 * @param {Immutable.Record} reply
 * @return {Immutable.Map}
 */

export function getMessagesForChat (messages, chat) {
  if (!chat) return new Immutable.Map()
  return messages.filter((message) => message.chatId === chat._id)
}

/**
 * Filter `messages` for `replies`.
 *
 * @param {Immutable.Map} messages
 * @param {Immutable.Map} chats
 * @param {Array} replies
 * @param {Immutable.Record} currentUser
 * @return {Immutable.Map}
 */

export function filterMessagesForRepliesAndUser (messages, chats, replies, currentUser) {
  if (!replies || !replies.length) return new Immutable.Map()
  const replyIds = replies.map((r) => r._id)
  const chatIds = chats.toArray().filter((c) => {
    return c.managerId === currentUser._id && replyIds.includes(c.replyId)
  }).map((c) => c._id)
  return messages.filter((m) => chatIds.includes(m.chatId))
}

/**
 * Count Butterfly Index for Replies.
 *
 * @param {Array} replies
 * @return {Number|Null}
 */

export function getButterflyIndex (replies) {
  if (!replies.length) return null
  const sum = replies.reduce((memo, reply) => {
    memo += getButterflyValue(reply.mood)
    return memo
  }, 0)
  return round(sum / replies.length, 1)
}

/**
 * Transform 1..5 value to 0..10 index.
 *
 * @param {Number} val
 * @return {Number}
 */

export function getButterflyValue (val) {
  return (val - 1) * 2.5
}

/**
 * Count Butterfly Mood drivers.
 *
 * @param {Array} replies
 * @return {Object|Null}
 */

export function getMoodDrivers (replies) {
  if (!replies.length) return null
  return {
    role: getMoodDriver('role'),
    management: getMoodDriver('management'),
    colleagues: getMoodDriver('colleagues'),
    environment: getMoodDriver('environment'),
    balance: getMoodDriver('balance')
  }

  function getMoodDriver (driver) {
    const sum = replies.reduce((memo, reply) => {
      memo += getButterflyValue(reply.moodDetails[driver])
      return memo
    }, 0)
    return round(sum / replies.length, 1)
  }
}

/**
 * Filter `groups` for `currentUser`, which has more than 4 users.
 *
 * @param {Immutable.Map} users
 * @param {Immutable.Map} groups
 * @param {Immutable.Record} currentUser
 * @return {Immutable.Map}
 */

export function getPossibleGroups (groups, users, currentUser) {
  return filterGroupsByUser(filterActive(groups), currentUser)
    .filter((g) => filterUsersByGroup(filterActive(users), g).size >= 4)
}

/**
 * Filter `questions` by `groupIds`.
 *
 * @param {Array} questions
 * @param {Array} groupIds
 * @return {Array}
 */

export function filterQuestionsByGroupIds (questions, groupIds) {
  return questions.filter((q) => {
    return groupIds.some((gId) => q.groupIds.includes(gId))
  })
}

/**
 * Filter `replies` by `questions`.
 *
 * @param {Immutable.Map} questions
 * @param {Immutable.Map} replies
 * @return {Immutable.Map}
 */

export function filterRepliesByQuestions (questions, replies) {
  const questionIds = questions.map((q) => q._id)
  return replies.filter((r) => {
    return questionIds.includes(r.questionId)
  })
}

/**
 * Filter `replies` by `groupIds`.
 *
 * @param {Immutable.Map} questions
 * @param {Immutable.Map} replies
 * @param {Array} groupIds
 * @return {Immutable.Map}
 */

export function filterRepliesByGroupIds (questions, replies, groupIds) {
  return filterRepliesByQuestions(filterQuestionsByGroupIds(questions, groupIds), replies)
}

/**
 * Get unread `comments` in `box` for `currentUser`.
 *
 * @param {Array} comments
 * @param {Immutable.Record} box
 * @param {Immutable.Record} currentUser
 * @return {Array}
 */

export function getUnreadComments (comments, box, currentUser) {
  const compareDate = Math.max(1464134400000, currentUser.createdAt) // we enabled counter at 2016-05-25
  if (box.createdAt < compareDate) return []
  const seenDate = box.seenAt ? box.seenAt.get(currentUser._id) : null
  if (!seenDate) return comments
  return comments.filter((comment) => comment.createdAt > seenDate)
}

/**
 * Filter comments.
 *
 * @param {Immutable.Map} replies
 * @return {Immutable.Map}
 */

export function filterComments (replies) {
  return replies.filter((r) => {
    return r.body || (r.moodComments && Object.keys(r.moodComments).length) // filter related replies
  })
}

/**
 * Get `box` questions for `currentUser`.
 *
 * @param {Immutable.Record} box
 * @param {Immutable.Record} currentUser
 * @return {Array}
 */

export function getBoxQuestionsForUser (box, currentUser) {
  const { hasAccessOnly, isAdmin } = currentUser
  const questions = box.questions.toJS()
  return isAdmin ? questions : filterQuestionsByGroupIds(questions, hasAccessOnly)
}

/**
 * Sort groups by driverIndex from worst to the best.
 * Pass this function to .sort()
 */

export function sortGroupsByDriverIndex (g1, g2) {
  if (g1.driverIndex === null && g2.driverIndex !== null) return 1
  if (g2.driverIndex === null && g1.driverIndex !== null) return -1
  if (g1.driverIndex === g2.driverIndex) return g1.name > g2.name ? 1 : -1
  if (g1.driverIndex > g2.driverIndex) return 1
  if (g1.driverIndex < g2.driverIndex) return -1
  return 0
}

/**
 * Get options for MT zoom by `moodSettings`.
 *
 * @param {Object} moodSettings
 * @return {Array}
 */

export function filterZoomOptionsByMoodSettings (options, { every }) {
  if (['other thursday', 'last thursday'].includes(every)) {
    return options.filter(val => !['1day', '1week'].includes(val))
  } else {
    return options
  }
}

/**
 * Return groups with enabled instantFeedback
 *
 * @param {Immutable.Map} groups
 * @return {Immutable.Map}
 */

export function filterInstantFeedbackGroups (groups) {
  return groups.filter(group => group.instantFeedback)
}
