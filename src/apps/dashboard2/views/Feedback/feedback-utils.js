import { mean, round } from 'lodash'
import { getReplyValueForPolls } from '../../../../utils/replies-utils'

/**
 * Get average value for `box` and `replies`.
 *
 * @param {Object} box
 * @param {Array} replies
 * @return {Number}
 */

export function getValueByBoxAndReplies ({ type, polls }, replies) {
  if (replies.size === 0) return null
  if (polls.length > 1) {
    const result = []
    replies.forEach((reply) => result.push(getReplyValueForPolls(reply)))
    return round(mean(result), 1)
  }
  if (type === 'smileys') {
    return getAverageSmileys(countSmileys(replies))
  } else if (type === 'rating') {
    return getAverageStars(countStars(replies))
  } else if (type === 'yesno') {
    return getAverageVibe(countVibe(replies))
  }
  return 0
}

/**
 * Count vibes.
 *
 * @param {Array} replies
 * @param {Object} opts
 * @return {Object} [ up, down ]
 */

export function countVibe (replies, { pollIndex } = {}) {
  return replies.reduce(reducer, [0, 0])

  function reducer (memo, r) {
    const val = typeof pollIndex === 'undefined' ? r.yesno : r.polls[pollIndex].yesno
    if (val) ++memo[0]
    else ++memo[1]
    return memo
  }
}

/**
 * Count smileys.
 *
 * @param {Array} replies
 * @param {Object} opts
 * @return {Array} [ happy, neutral, unhappy ]
 */

export function countSmileys (replies, { pollIndex } = {}) {
  return replies.reduce(reducer, [0, 0, 0])

  function reducer (memo, r) {
    const val = typeof pollIndex === 'undefined' ? r.smileys : r.polls[pollIndex].smileys
    if (val === 1) memo[0] += 1
    else if (val === 0) memo[1] += 1
    else if (val === -1) memo[2] += 1
    return memo
  }
}

/**
 * Count stars.
 *
 * @param {Array} replies
 * @param {Object} opts
 * @return {Array} [ star1, star2, star3, star4, star5 ]
 */

export function countStars (replies, { pollIndex } = {}) {
  return replies.reduce(reducer, [0, 0, 0, 0, 0])

  function reducer (memo, r) {
    const val = typeof pollIndex === 'undefined' ? r.rating : r.polls[pollIndex].rating
    memo[val - 1] += 1
    return memo
  }
}

/**
 * Get average vibe.
 *
 * @param {Array} [up, down] - result of countVibe
 * @return {Number|Null}
 */

export function getAverageVibe ([up, down]) {
  if ((up + down) === 0) return null
  return up > down ? 1 : (up === down ? 0 : -1)
}

/**
 * Get average smiley.
 *
 * @param {Array} [unhappy, neutral, happy] - result of countSmileys
 * @return {Number|Null}
 */

export function getAverageSmileys ([happy, neutral, unhappy]) {
  const total = unhappy + neutral + happy
  if (!total) return null
  return Math.round((happy - unhappy) / total)
}

/**
 * Get average stars.
 *
 * @param {Array} [unhappy, neutral, happy] - result of countStars
 * @return {Boolean}
 */

export function getAverageStars ([s1, s2, s3, s4, s5]) {
  const total = s1 + s2 + s3 + s4 + s5
  if (!total) return null
  const average = (s1 + (s2 * 2) + (s3 * 3) + (s4 * 4) + (s5 * 5)) / total
  return parseFloat((average).toFixed(1), 10)
}
