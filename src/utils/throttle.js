import { throttle } from 'lodash'

/**
 * Configured leading `throttle`.
 * Use it when you have to notify about event immediately, like start typing.
 *
 * @param {Function} fn
 * @return {Function}
 */

export function leading (fn, timeout = 500) {
  return throttle(fn, timeout, { trailing: false, leading: true })
}

/**
 * Configured trailing `throttle`.
 * Use it when you have to get the fact of event after a few fast repetion, like resize.
 *
 * @param {Function} fn
 * @return {Function}
 */

export function trailing (fn, timeout = 500) {
  return throttle(fn, timeout, { trailing: true, leading: false })
}
