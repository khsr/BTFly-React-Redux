/**
 * Make wrapper around `promise` in order to make it cancelable
 *
 * @param {Promise} promise
 * @returns {Object} wrapper
 * @returns {Promise} wrapper.promise - wrapped promise
 * @returns {Function} cancel - function for cancellation promise
 */

export const makeCancelable = (promise) => {
  let _hasCanceled = false

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(val => !_hasCanceled && resolve(val))
    promise.catch(error => !_hasCanceled && reject(error))
  })

  return {
    promise: wrappedPromise,
    cancel () { _hasCanceled = true }
  }
}
