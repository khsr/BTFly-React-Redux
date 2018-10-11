import formText from './text'
import { requestApi } from '../../../utils/request'
import initDebug from 'debug'
const isSubdomain = /^[a-z][a-z0-9_-]+$/
const debug = initDebug('bf:components/form/plugins/subdomain')

export default function formSubdomain (selector, { reverse } = {}) {
  return (form) => {
    const subdomain = formText(selector, { regexp: isSubdomain, request: checkSubdomain })(form)
    subdomain.getValue = () => subdomain.$el.value.trim().toLowerCase()
    return subdomain
  }

  /**
   * Check subdomain availability.
   *
   * @param {String} subdomain
   * @return {Promise} -> Boolean
   */

  function checkSubdomain (subdomain) {
    debug('%s: check subdomain "%s"', selector, subdomain)
    return requestApi(`/check/subdomain/${subdomain}`).then((res) => {
      return res.text()
    }).then((body) => {
      return body === 'true'
    }).then((valid) => {
      return reverse ? !valid : valid
    })
  }
}
