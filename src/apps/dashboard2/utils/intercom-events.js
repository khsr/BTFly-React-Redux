import * as intercom from './intercom'
import { store } from '../redux'
import { filterActive } from '../redux/data-utils'

export function boot ({ userHash, intercomAppId }) {
  const { currentCompany, currentUser, users, groups } = store.getState()
  intercom.boot({
    user_hash: userHash,
    app_id: intercomAppId,
    user_id: currentUser._id,
    created_at: intercom.formatDate(currentUser.createdAt),
    name: currentUser.fullName,
    email: currentUser.email,
    role: currentUser.role,
    has_picture: currentUser.get('picture') ? 'yes' : 'no',
    company: {
      id: currentCompany._id,
      name: currentCompany.subdomain,
      created_at: intercom.formatDate(currentCompany.createdAt),
      users_count: filterActive(users).size,
      groups_count: filterActive(groups).size
    }
  })
}
