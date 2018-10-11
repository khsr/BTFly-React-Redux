import initDebug from 'debug'
import { requestHost } from '../../../utils/request'
import { isDev } from './env'
const debug = initDebug('bf:utils/request')

export default function request (path, status, opts) {
  return requestHost(path, opts)
  .then((res) => {
    if (res.status !== status) throw new Error(`invalid response: ${res.status}`)
    if (res.status === 204) return Promise.resolve({})
    return res.json()
  })
  .then((e) => {
    if (!isDev) return e
    // emulate network delay
    return new Promise((resolve) => setTimeout(() => resolve(e), 1000))
  })
  .catch((err) => {
    debug(err)
    if (window.Raven) window.Raven.captureException(err)
    window.alert('Sorry, unexpeted error.')
    throw err
  })
}
