import moment from './moment'

/**
 * Count delay between `now` and date specified as dayOfWeek, hourOfDay, weeksDelay.
 *
 * @param {Object} opts
 * - {String} every - day, thursday, other thursday, last thursday
 * - {Number} hourOfDay - 10 AM, 4 PM (hourOfDay 0..24)
 * - {Number} minutes - usually 0
 * @return {Number} delay in miliseconds
 */

export default function countDelay ({ every, hours, minutes, timezone }, now = new Date()) {
  let date

  switch (every) {
    case 'day':
      date = setHM(initDate().startOf('day'))
      if (now > date) date.add(1, 'day')
      break
    case 'thursday':
      date = setHM(initDate().startOf('isoweek').add(3, 'days'))
      if (now > date) date.add(1, 'week')
      break
    case 'other thursday':
      date = setHM(initDate().startOf('isoweek').add(3, 'days'))
      if (now > date) date.add(2, 'weeks')
      break
    case 'last thursday':
      date = setHM(initDate().endOf('month').startOf('day').isoWeekday(4))
      if (now > date) date.add(1, 'month')
      break
    default:
      throw new Error('invalid every')
  }

  return date - now

  function setHM (m) {
    if (hours > 24 || hours < 0) throw new Error('invalid hours')
    if (minutes > 60 || minutes < 0) throw new Error('invalid minutes')
    m.add(minutes, 'minutes')
    return m.add(hours, 'hours')
  }

  function initDate () {
    return moment.tz(now, timezone || 'Europe/London')
  }
}
