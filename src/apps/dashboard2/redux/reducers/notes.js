import { bootstrap } from '../../../../components/boot'
import { initRecord, create, update, init } from '../immutable-utils'

class Note extends initRecord(['boxId', 'managerId', 'body', 'seenAt', 'groupIds', 'allCompany']) {}

const defaultNotes = init(bootstrap.notes, Note)

export function notes (state = defaultNotes, action) {
  switch (action.type) {
    case 'CREATE_NOTE': return create(state, action, Note)
    case 'UPDATE_NOTE': return update(state, action)
    default: return state
  }
}
