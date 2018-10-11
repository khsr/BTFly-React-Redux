import babyParse from 'babyparse'
import { getReplyValue } from '../../../utils/replies-utils'
import { formatDateTime } from '../utils/moment'
import { getButterflyValue } from './data-utils'

/**
 * Export `replies` to CSV.
 *
 * @param {Object} box
 * @param {Array} replies
 * @return {String}
 */

export function exportRepliesToCSV (box, replies) {
  if (!replies.length) return '#'
  const { type } = box
  return babyParse.unparse({
    fields: ['Date', 'Value', 'Comment'],
    data: replies.map((reply) => {
      return [formatDateTime(reply.createdAt), getReplyValue(reply, type), reply.body]
    })
  })
}

/**
 * Export `replies` to CSV.
 *
 * @param {Object} box
 * @param {Array} replies
 * @return {String}
 */

export function exportMoodRepliesToCSV (box, replies) {
  if (!replies.length) return '#'
  const parseCommentToText = ({ body, moodComments }) => {
    let comment = ''
    if (body) comment += body
    if (Object.keys(moodComments).length > 0) {
      Object.keys(moodComments).forEach((detail) => {
        comment += (comment.length ? '\n' : '') + moodComments[detail]
      })
    }
    return comment
  }
  return babyParse.unparse({
    fields: ['Date', 'Happiness', 'Role', 'Management', 'Colleagues', 'Workplace', 'Balance', 'Comments'],
    data: replies.map((reply) => {
      const hasDetails = Object.keys(reply.moodDetails).length > 0
      const getDetail = (detail) => {
        return hasDetails ? getButterflyValue(reply.moodDetails[detail]) : ''
      }
      return [
        formatDateTime(reply.createdAt),
        getButterflyValue(reply.mood),
        getDetail('role'),
        getDetail('management'),
        getDetail('colleagues'),
        getDetail('environment'),
        getDetail('balance'),
        parseCommentToText(reply)
      ]
    })
  })
}

/**
 * Export `selectedUsers` users to CSV.
 *
 * @param {Array} selectedUsers
 * @param {Object} groups
 * @return {String}
 */

export function exportUsersToCSV (selectedUsers, groups) {
  if (!selectedUsers.length) return '#'
  const csv = babyParse.unparse({
    fields: ['Full Name', 'Email', 'Role', 'Tags', 'Manager For'],
    data: selectedUsers.map(({ fullName, email, role, groupIds, hasAccessOnly }) => {
      const tags = formatGroups(groupIds)
      const managerFor = role !== 'manager' ? '' : formatGroups(hasAccessOnly)
      return [fullName, email, role, tags, managerFor]
    })
  })
  return csv

  function formatGroups (groupIds = []) {
    return groupIds
    .filter((gId) => groups[gId])
    .map((gId) => groups[gId].name).join(',')
  }
}
