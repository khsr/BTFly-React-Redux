
/**
 * Lists.
 */

export const allDrivers = ['role', 'management', 'colleagues', 'environment', 'balance']
export const allMoods = [5, 4, 3, 2, 1]

/**
 * Count mood values.
 *
 * @param {Array} replies
 * @return {Array} [ mood1, mood2, mood3, mood4, mood5 ]
 */

export function countMoodValues (replies) {
  return replies.reduce(reducer, [0, 0, 0, 0, 0])

  function reducer (memo, r) {
    memo[r.mood - 1] += 1
    return memo
  }
}

/**
 * Sort drivers.
 *
 * @param {Array} drivers
 * @return {Array}
 */

export function sortDrivers (drivers) {
  return drivers.sort((d1, d2) => {
    const index1 = allDrivers.indexOf(d1)
    const index2 = allDrivers.indexOf(d2)
    return index1 === index2 ? 0 : (index1 > index2 ? 1 : -1)
  })
}

/**
 * Filter `replies` which has moodDetails field.
 *
 * @param {Array} replies
 * @return {Array}
 */

export function filterMoodDetails (replies) {
  return replies.filter((r) => {
    return r.moodDetails && Object.keys(r.moodDetails).length
  })
}

/**
 * Get appropriate value based on `driver`.
 */

export function getDriverFor (driver, { bfIndex, drivers }) {
  return driver === 'mood' ? bfIndex : (drivers ? drivers[driver] : null)
}
