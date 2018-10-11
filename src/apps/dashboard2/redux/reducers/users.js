import Immutable, { fromJS } from 'immutable'
import { bootstrap, filesHost, assetsHost } from '../../../../components/boot'
import { initRecord, create, createMany, update, updateMany, init } from '../immutable-utils'

class User extends initRecord([
  'email', 'title', 'picture', 'role', 'notificationsDate',
  'fullName', 'firstName', 'lastName', 'groupIds', 'hasAccessOnly',
  'firstLoginAt', 'lastLoginAt', 'slack', 'preferred'
]) {
  get fullName () {
    return this.get('fullName') || `${this.get('firstName')} ${this.get('lastName')}`.trim() || ''
  }

  get picture () {
    return this.hasPicture
    ? `${filesHost}/${this.get('picture')}`
    : `${assetsHost}/default-image.v2.jpg`
  }

  get role () {
    return this.get('role') || 'user'
  }

  get hasAccessOnly () {
    return this.get('hasAccessOnly') || new Immutable.List()
  }

  get isAdmin () { return this.role === 'admin' }
  get isManager () { return this.role === 'manager' }
  get isUser () { return this.role === 'user' }

  get alreadyLoggedIn () { return !!this.get('firstLoginAt') }
  get hasPicture () { return !!this.get('picture') }
}

const defaultCurrentUser = new User(bootstrap.user)
const defaultUsers = init(bootstrap.users, User)

export function currentUser (state = defaultCurrentUser, action) {
  switch (action.type) {
    case 'UPDATE_CURRENT_USER': return state.merge(fromJS(action.attrs))
    default: return state
  }
}

export function users (state = defaultUsers, action) {
  switch (action.type) {
    case 'CREATE_USER': return create(state, action, User)
    case 'CREATE_USERS': return createMany(state, action, User)
    case 'UPDATE_USER':
    case 'UPDATE_CURRENT_USER': return update(state, action)
    case 'UPDATE_USERS': return updateMany(state, action)
    default: return state
  }
}
