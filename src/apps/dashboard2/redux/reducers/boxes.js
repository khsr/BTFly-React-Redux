import { bootstrap } from '../../../../components/boot'
import { initRecord, create, update, init } from '../immutable-utils'

class Box extends initRecord(['name', 'type', 'display', 'groupIds', 'polls', 'imageUrl',
'status', 'questions', 'resendedAt', 'scheduledAt', 'seenAt', 'seenNotesAt', 'moodSharedAt']) {}

const defaultBoxes = init(bootstrap.boxes, Box)

export function boxes (state = defaultBoxes, action) {
  switch (action.type) {
    case 'CREATE_BOX': return create(state, action, Box)
    case 'CREATE_MOOD_BOX': return create(state, action, Box)
    case 'UPDATE_BOX': return update(state, action)
    default: return state
  }
}
