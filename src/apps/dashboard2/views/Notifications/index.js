import React, { Component } from 'react'
import iconFeedback from './iconFeedback.svg?react'
import iconMood from './iconMood.svg?react'
import { connect } from '../../utils/performance'
import moment from '../../utils/moment'
import { Icon } from '../../components/Icon'
import iconNotifications from './iconNotifications.svg?react'
import t from '../../../../utils/locales'
import { Container, ContainerHeaderWithIcon, ContainerBody } from '../../components/Container'
import { updateNotificationsDate } from '../../redux/actions/users'
import { getNotificationsForCurrentUser } from '../../redux/selectors/notifications'
import { MARK_AS_READ_TIMEOUT } from '../../config'
import './index.css'

const mapStateToProps = (state) => {
  const { users, groups, currentUser } = state
  const { notificationsDate } = currentUser
  const currentUserNotifications = getNotificationsForCurrentUser(state)
  const feedbackText = (n) => {
    const box = n.data
    const user = users.get(box.get('managerId'))
    const departments = box.get('groupIds').map((groupId) => groups.get(groupId).name).join(', ')
    return t('dashboard.notifications.feedback-text', {
      fullName: user.fullName,
      question: box.get('name'),
      departments
    })
  }
  const moodText = (n) => {
    const count = n.data.get('questionsCount')
    return t('dashboard.notifications.mood-text', { count })
  }
  const preparedNotifications = currentUserNotifications
  .slice(0, 30).toArray().map((n) => {
    return {
      _id: n._id,
      icon: n.isFeedback ? iconFeedback : iconMood,
      text: n.isFeedback ? feedbackText(n, users, groups) : (n.isMood ? moodText(n) : ''),
      date: moment(n.createdAt).fromNow(),
      isUnread: !notificationsDate || notificationsDate < n.createdAt
    }
  })

  return {
    isEmpty: !preparedNotifications.length,
    hasUnreadNotifications: preparedNotifications.some((n) => n.isUnread),
    notifications: preparedNotifications
  }
}

class Notifications extends Component {
  componentDidMount () {
    this.componentWillUpdate()
  }

  componentWillUpdate () {
    const { hasUnreadNotifications, dispatch } = this.props
    if (hasUnreadNotifications) dispatch(updateNotificationsDate({ timeout: MARK_AS_READ_TIMEOUT }))
  }

  render () {
    const { notifications, isEmpty } = this.props
    return (
      <Container>
        <ContainerHeaderWithIcon text={t('dashboard.notifications.title')} icon={iconNotifications} />
        <ContainerBody>
        {isEmpty ? (
          <div className="bf-NotificationsEmpty">
            {t('dashboard.notifications.empty-message')}
          </div>
        ) : (
          notifications.map(({ _id, icon, text, date, isUnread }) => {
            return (
              <div key={_id} className={`bf-NotificationsItem${isUnread ? ' is-unread' : ''}`}>
                <Icon className="bf-NotificationsItem-icon" icon={icon} />
                <div className="bf-NotificationsItem-content">
                  <div className="bf-NotificationsItem-content-text" dangerouslySetInnerHTML={{ __html: text }} />
                  <div className="bf-NotificationsItem-content-date">{date}</div>
                </div>
              </div>
            )
          })
        )}
        </ContainerBody>
      </Container>
    )
  }
}

export default connect(mapStateToProps)(Notifications)
