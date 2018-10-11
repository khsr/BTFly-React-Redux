import Immutable, { Record as createRecord, fromJS } from 'immutable'
import { fromPairs } from 'lodash'

/**
 * Default attributes for each model.
 */

const defaultAttrs = ['_id', 'createdAt', 'updatedAt', 'deletedAt']

/**
 * Init Record class with `attrs`.
 *
 * @param {Array} attrs
 * @return {Record}
 */

export function initRecord (attrs) {
  const pairs = attrs.concat(defaultAttrs).map((attr) => [attr, null])
  return createRecord(fromPairs(pairs))
}

export function init (items, Record, fn) {
  if (typeof fn === 'function') items = items.filter(fn)
  return new Immutable.Map(items.map((item) => {
    return [item._id, new Record(fromJS(item))]
  }))
}

export function create (state, { attrs }, Record) {
  return state.set(attrs._id, new Record(fromJS(attrs)))
}

export function createMany (state, action, Record) {
  return state.withMutations((map) => {
    action.attrs.forEach((attrs) => {
      map.set(attrs._id, new Record(fromJS(attrs)))
    })
  })
}

export function update (state, { attrs }) {
  const obj = state.get(attrs._id)
  // FIXME: sometimes object can't be found, instead throwing an error
  // we just ignore it this is a sync/race issue
  if (!obj) return state
  return state.set(attrs._id, obj.merge(fromJS(attrs)))
}

export function updateMany (state, action) {
  return state.withMutations((map) => {
    action.attrs.forEach((attrs) => {
      // FIXME: sometimes object can't be found, instead throwing an error
      // we just ignore it this is a sync/race issue
      const obj = map.get(attrs._id)
      if (obj) map.set(attrs._id, obj.merge(fromJS(attrs)))
    })
  })
}
