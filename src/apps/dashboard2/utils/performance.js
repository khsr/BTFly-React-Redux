import { connect as reduxConnect } from 'react-redux'
import { createSelector as reselectCreateSelector } from 'reselect'
import { forEach, orderBy, noop, initial, last, round, sumBy } from 'lodash'
import { isProd } from './env'

/**
 * Expose api.
 */

export const startRender = isProd ? noop : startViewRender
export const endRender = isProd ? noop : endViewRender
export const connect = isProd ? reduxConnect : measureConnect
export const createSelector = isProd ? reselectCreateSelector : measureCreateSelector

/**
 * Link to avaliable `now()`.
 */

const now = typeof performance !== 'undefined' && typeof performance.now === 'function'
? performance.now.bind(performance)
: Date.now

/**
 * Shared variables.
 */

let values = []
let current = null
let startTime = null

/**
 * Set `start` point.
 */

function startViewRender () {
  values = []
  current = null
  startTime = now()
  if (typeof window.Perf !== 'undefined') window.Perf.start()
}

/**
 * Set `end` point and display results.
 */

function endViewRender () {
  const time = now() - startTime
  console.groupCollapsed('%c render: %sms', 'color: #1B828E;', time)
  forEach(orderBy(values, 'time', 'desc'), ({ componentName, time, selectors }) => {
    console.groupCollapsed('%s %sms (%s)', componentName, time, selectors.length)
    const groupedSelectors = selectors.reduce((memo, { selectorName, time }) => {
      if (typeof memo[selectorName] === 'undefined') memo[selectorName] = { selectorName, time: 0, count: 0 }
      memo[selectorName].time += time
      memo[selectorName].count += 1
      return memo
    }, {})
    if (selectors.length) console.table(orderBy(groupedSelectors, 'time', 'desc'))
    console.groupEnd()
  })
  if (typeof window.Perf !== 'undefined') {
    window.Perf.stop()
    const totalInclusive = round(sumBy(window.Perf.getInclusive(), 'inclusiveRenderDuration'), 3)
    const totalWasted = round(sumBy(window.Perf.getWasted(), 'inclusiveRenderDuration'), 3)
    if (totalInclusive) {
      console.groupCollapsed('React Inclusive: %sms', totalInclusive)
      window.Perf.printExclusive()
      console.groupEnd()
    }
    if (totalWasted) {
      console.groupCollapsed('React Wasted: %sms', totalWasted)
      window.Perf.printWasted()
      console.groupEnd()
    }
  }
  console.groupEnd()
}

/**
 * Measure execution of `mapStateToProps`,
 * Match react-redux's connect params signature.
 */

function measureConnect (mapStateToProps, ...args) {
  return (Component) => {
    const componentName = Component.prototype.constructor.name
    const patchedMapStateToProps = (...args) => {
      const startTime = now()
      current = { componentName, time: 0, selectors: [] }
      values.push(current)
      const result = mapStateToProps(...args)
      current.time = round(now() - startTime, 3)
      current = null
      return result
    }
    return reduxConnect(patchedMapStateToProps, ...args)(Component)
  }
}

/**
 * Measure execution of `createSelector` function
 * using its name as identifier.
 * Match reselect's createSelector params signature.
 */

function measureCreateSelector (...args) {
  const fn = last(args)
  const argsWithoutLast = initial(args)
  const selectorName = fn.name || 'noname'
  return reselectCreateSelector(...argsWithoutLast, (...params) => {
    const startTime = now()
    const result = fn(...params)
    if (current) current.selectors.push({ time: round(now() - startTime, 3), selectorName })
    return result
  })
}
