import { requestApi } from './request'
import subdomain from './subdomain'

/**
 * Check email existence.
 *
 * @param {String} email
 * @return {Promise} -> Boolean
 */

export default function checkEmail (email, { reverse, acceptValue }) {
  if (acceptValue === email) return Promise.resolve(true)
  const suffix = `?subdomain=${subdomain}`

  return requestApi(`/check/email/${email}${suffix}`).then((res) => {
    return res.text().then((body) => {
      return body === 'true'
    })
  }).then((valid) => {
    return reverse ? !valid : valid
  })
}
