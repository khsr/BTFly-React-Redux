import { bootstrap } from '../../../../components/boot'
import { initRecord, create, update, updateMany, init } from '../immutable-utils'

class Group extends initRecord(['name', 'managerId', 'moodTracking', 'instantFeedback']) {}

const defaultGroups = init(bootstrap.groups, Group)

export default function groups (state = defaultGroups, action) {
  switch (action.type) {
    case 'CREATE_GROUP': return create(state, action, Group)
    case 'UPDATE_GROUP': return update(state, action)
    case 'UPDATE_GROUPS': return updateMany(state, action)
    default: return state
  }
}
