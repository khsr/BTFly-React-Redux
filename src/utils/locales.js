import { translation } from '../components/boot'

/**
 * Cache results of `translate` calls.
 */

const cache = {}

/**
 * Check ES6 delimeter
 * https://github.com/lodash/lodash/blob/master/lodash.js#L143
 */

const isTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/
const isTemplateG = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g

/**
 * Translate `prop` with optional `hash` arguments.
 *
 * @param {String} prop
 * @param {Object} [hash]
 * @return {String}
 */

export default function t (prop, hash = {}) {
  if (hash.hash) hash = hash.hash
  if (typeof cache[prop] === 'undefined') {
    cache[prop] = translation[prop] || ''
    if (cache[prop] === '') console.error('error: missing translation "%s"', prop) // eslint-disable-line no-console
    if (isTemplate.test(cache[prop])) cache[prop] = template(cache[prop])
  }
  return typeof cache[prop] === 'string' ? cache[prop] : cache[prop](hash)
}

/**
 * Make a shorthand for t call with `prefix`.
 *
 * @param {String} prefix
 * @return {Function}
 */

export function namespace (prefix) {
  return (prop, hash) => t(`${prefix}.${prop}`, hash)
}

/**
 * Tiny string templation.
 * Inspired by https://github.com/matthewmueller/subs
 *
 * Examples:
 *
 *   template('hi my name is ${name}!', { name: 'Aleksey' })
 *
 * @param {String} str
 * @param {Function} subs(obj)
 * @return {String}
 */

function template (str) {
  return (obj) => {
    return str.replace(isTemplateG, (match, key) => {
      const v = obj[key]
      return v === undefined ? '' : v
    })
  }
}
