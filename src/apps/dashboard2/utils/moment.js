import moment from 'moment-timezone'
import 'moment/locale/fr'
import 'moment/locale/hu'

/**
 * Set locale.
 * http://momentjs.com/docs/#/i18n/changing-locale/
 */

const lng = document.documentElement.lang || 'en'
moment.locale(lng)

/**
 * Expose moment instance.
 */

export default moment

/**
 * Format `createdAt`.
 *
 * @param {Number} createdAt
 * @return {String}
 */

export function formatDateTime (createdAt) {
  return moment(new Date(createdAt)).format('MMM Do YYYY, h:mm a')
}

/**
 * Format `createdAt`.
 *
 * @param {Number} createdAt
 * @return {String}
 */

export function formatDate (createdAt) {
  return moment(new Date(createdAt)).format('MMMM Do YYYY')
}
