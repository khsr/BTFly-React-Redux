import { bootstrap } from '../../../../components/boot'
import { initRecord, create, update, updateMany, init } from '../immutable-utils'

class Reply extends initRecord(['boxId', 'userId', 'questionId', 'polls', 'smileys',
'yesno', 'rating', 'status', 'body', 'mood', 'moodDetails', 'moodComments', 'notifiedManagerIds', 'notifiedAt', 'resolvedAt', 'resolvedBy']) {
  get polls () {
    if (!this.get('polls')) return []
    return this.get('polls').toArray().map((p) => p.toObject())
  }

  get moodDetails () {
    return this.get('moodDetails') ? this.get('moodDetails').toObject() : {}
  }

  get moodComments () {
    return this.get('moodComments') ? this.get('moodComments').toObject() : {}
  }
}

const defaultReplies = init(bootstrap.replies, Reply)

export function replies (state = defaultReplies, action) {
  switch (action.type) {
    case 'CREATE_REPLY': return create(state, action, Reply)
    case 'UPDATE_REPLY': return update(state, action)
    case 'UPDATE_REPLIES': return updateMany(state, action)
    default: return state
  }
}
