import { bootstrap } from '../../../../components/boot'
import { initRecord, create, init } from '../immutable-utils'

class Notification extends initRecord(['sid', 'type', 'data', 'userId']) {
  get isMood () { return this.type === 'box-created' && this.data.get('type') === 'mood' }
  get isFeedback () { return this.type === 'box-created' && this.data.get('type') !== 'mood' }
}

const defaultNotifications = init(bootstrap.notifications, Notification)

export default function notifications (state = defaultNotifications, action) {
  switch (action.type) {
    case 'CREATE_NOTIFICATION': return create(state, action, Notification)
    default: return state
  }
}
