import { createSelector } from '../../utils/performance'
import { filterNotifications } from '../data-utils'
import { getCurrentUser } from './users'

export const getNotifications = state => state.notifications

export const getNotificationsForCurrentUser = createSelector(
  [getNotifications, getCurrentUser],
  function getNotificationsForCurrentUser (notifications, currentUser) {
    return filterNotifications(notifications, currentUser).sortBy(n => -n.createdAt)
  }
)

export const getUnreadNotificationsNumber = createSelector(
  [getNotificationsForCurrentUser, getCurrentUser],
  function getUnreadNotificationsNumber (notifications, currentUser) {
    return notifications.filter(n => currentUser.notificationsDate < n.createdAt).size
  }
)
