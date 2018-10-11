import 'core-js/es6'
import 'core-js/stage/4'
import 'whatwg-fetch'
import touchAction from 'touch-action'

/**
 * Expose env variables.
 */

export const csrf = getMetaContent('csrf')
export const host = getMetaContent('host')
export const assetsHost = getMetaContent('assets-host')
export const apiHost = getMetaContent('api-host')
export const filesHost = getMetaContent('files-host')
export const bootstrap = parseIdTextToJSON('bootstrap')
export const translation = parseIdTextToJSON('translation')

function getMetaContent (key) {
  const el = document.querySelector(`meta[name="${key}"]`)
  return el ? el.content : null
}

function parseIdTextToJSON (id) {
  const el = document.getElementById(id)
  return el ? JSON.parse(el.text) : null
}

/**
 * Init Sentry.
 */

const sentryPublicDsn = document.querySelector('meta[name="sentry-public-dsn"]')
if (sentryPublicDsn && sentryPublicDsn.content) {
  const s = document.createElement('script')
  s.src = `${exports.assetsHost}/raven-min.v304.js`
  s.async = true
  s.onload = () => {
    window.Raven.config(sentryPublicDsn.content).install()
  }
  document.body.appendChild(s)
}

/**
 * Init touch-action.
 */

touchAction({ src: `${exports.assetsHost}/fastclick-min.v106.js` })
