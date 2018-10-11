import resolve from 'resolve-url'
import { apiHost, csrf } from '../components/boot'

/**
 * Send request to url.
 *
 * @param {String} url
 * @param {Object} [params]
 *   @param {String} method - set HTTP verb, GET by default
 *   @param {String} token - set Authorization header
 *   @param {Object} body - set body
 * @param {Object} [opts] - initial options
 * @return {Function}
 */

export default function request (url, { token, body, method }, opts) {
  if (token) opts.headers.Authorization = `Bearer ${token}`
  if (method) opts.method = method
  if (body && Object.keys(body).length) opts.body = JSON.stringify(body)
  return window.fetch(url, opts)
}

/**
 * Request server API.
 */

export function requestApi (url, params = {}) {
  return request(resolve(apiHost, url), params, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * Send request to local route.
 */

export function requestHost (url, params) {
  return request(resolve('/', url), params, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrf
    }
  })
}

/**
 * Handle invalid response error.
 *
 * @param {Response} res
 */

export function onResponseError (res) {
  if (window.Raven) {
    window.Raven.captureException(new Error('' +
      `Response status: ${res.status};` +
      `Response text: ${res.text};`
    ))
  }
  window.alert('Sorry, unexpeted error.')
}
