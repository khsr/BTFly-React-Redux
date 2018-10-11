import { bootstrap } from '../../../components/boot'
import asyncSocket from '../../../components/async-socket'

/**
 * Connect to socket.io
 */

export const socket = asyncSocket('/', { upgrade: false })

/**
 * Check if `event` is valid and does not belong to current session.
 *
 * @param {Object} event
 * @return {Boolean}
 */

export function isValid (event) {
  if (!bootstrap.session.roomIds.includes(event.to)) return false
  if (event.sid === bootstrap.session._id) return false
  return true
}

/**
 * Subscribe on `eventName` and call `fn` callback,
 * when event is valid.
 *
 * @param {String} eventName
 * @param {Function} fn
 * @param {Function} [validator]
 * @return {Function} unsubscribe
 */

export function subscribe (eventName, fn, validator = isValid) {
  const listener = (e) => {
    if (validator(e)) fn(e)
  }
  socket.addEventListener(eventName, listener)
  return () => {
    socket.removeEventListener(eventName, listener)
  }
}
