import urlRegex from 'url-regex'
import { escape, mean, round } from 'lodash'
const isUrl = urlRegex()

/**
 * Parse links and new lines in `body`.
 *
 * @param {String} body
 * @return {String}
 */

export function parseBody (body) {
  return escape(body || '').split(' ').map((s) => {
    return !isUrl.test(s) ? s : `<a target="_blank" href="${s}">${s}</a>`
  }).join(' ').replace(/\n/g, '<br>')
}

/**
 * Get `box` type.
 *
 * @param {Object|Immutable.Record} box
 * @return {String}
 */

export function getBoxType (box) {
  const { display, type } = box
  if (type) return type

  if (display.includes('polls')) {
    return 'polls'
  } else if (display.includes('smileys')) {
    return 'smileys'
  } else if (display.includes('rating')) {
    return 'rating'
  } else {
    return 'yesno'
  }
}

/**
 * Get `poll` type
 *
 * @param {Object} poll
 * @return {String}
 */

export function getPollType ({ smileys, rating }) {
  return smileys !== null ? 'smileys' : (rating !== null ? 'rating' : 'yesno')
}

/**
 * Get reply value.
 *
 * @param {Object|Immutable.Record} reply
 * @param {String} boxType
 * @param {Object} opts
 * @return {Any}
 */

export function getReplyValue (reply, boxType, { pollIndex } = {}) {
  const valueField = boxType === 'smileys'
  ? 'smileys'
  : (boxType === 'rating' ? 'rating' : (boxType === 'yesno' ? 'yesno' : 'mood'))
  return boxType !== 'polls'
  ? (boxType === 'yesno' ? (reply[valueField] ? 1 : -1) : reply[valueField])
  : (typeof pollIndex !== 'undefined' ? reply.polls[pollIndex][valueField] : getReplyValueForPolls(reply))
}

/**
 * Get aggregated value for `polls`
 *
 * @param {Object} reply
 * @return {Number}
 */

export function getReplyValueForPolls (reply) {
  const result = []
  reply.polls.forEach((poll) => {
    const type = getPollType(poll)
    const value = getReplyValue(poll, type)
    if (type === 'smileys' || type === 'yesno') {
      result.push((value + 1) * 5) // -1 => 0, 0 => 5, 1 => 10
    } else if (type === 'rating') {
      result.push((value - 1) * 2.5) // 1 -> 0, 2 -> 2.5, 3 -> 5, 4 -> 7.5, 5 -> 10
    }
  })
  return round(mean(result), 1)
}
