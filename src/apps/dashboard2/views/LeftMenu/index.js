import React, { PureComponent } from 'react'
import { Link } from 'react-router'
import sEmitter from 'storage-emitter'
import { connect } from '../../utils/performance'
import { MoodIcon } from '../../components/MoodIcon'
import { Icon } from '../../components/Icon'
import iconLogout from './icons/logout.svg?react'
import iconFeedback from './icons/feedback.svg?react'
import iconNotifications from './icons/notifications.svg?react'
import iconSettings from './icons/settings.svg?react'
import iconTeam from './icons/team.svg?react'
import { Logo } from '../../components/Logo'
import { LeftMenuListItem } from './LeftMenuListItem'
import { namespace } from '../../../../utils/locales'
import { getCurrentUser } from '../../redux/selectors/users'
import { getUnreadNotesNumber } from '../../redux/selectors/notes'
import { getUnreadMoodCommentsNumber } from '../../redux/selectors/mood'
import { geedUnreadFeedbackNumber } from '../../redux/selectors/feedback'
import { getUnreadNotificationsNumber } from '../../redux/selectors/notifications'
import './index.css'
const tn = namespace('dashboard.menu')

const mapStateToProps = (state) => {
  const currentUser = getCurrentUser(state)
  const unreadMoodNotes = getUnreadNotesNumber(state)
  const unreadMoodComments = getUnreadMoodCommentsNumber(state)
  const unreadFeedback = geedUnreadFeedbackNumber(state)
  const unreadMood = unreadMoodNotes + unreadMoodComments
  const unreadNotifications = Math.min(getUnreadNotificationsNumber(state), 30)

  return {
    href: location.href,
    currentUser,
    unreadNotifications,
    generalMood: 10,
    unreadMood,
    unreadFeedback
  }
}

class LeftMenu extends PureComponent {
  onLogout () {
    sEmitter.emit('logout')
  }

  render () {
    const { isVisible, currentUser, generalMood,
      unreadNotifications, unreadFeedback, unreadMood, openGetFeedback } = this.props
    return (
      <div className={isVisible ? 'bf-LeftMenu bf-LeftMenu--open' : 'bf-LeftMenu'}>
        <Link to="/profile" className="bf-LeftMenu-profile">
          <img src={currentUser.picture} />
          <span>{currentUser.fullName}</span>
        </Link>

        <button className="bf-LeftMenu-ask" onClick={openGetFeedback}>
          <Logo isSmall />
          {tn('ask')}
        </button>

        <ul className="bf-LeftMenuList">
          <LeftMenuListItem
            to="/mood"
            text={tn('mt')}
            icon={<MoodIcon isSmall bfIndex={generalMood} />}
            counter={unreadMood}
          />
          <LeftMenuListItem
            to="/feedback"
            text={tn('if')}
            icon={<Icon icon={iconFeedback} />}
            counter={unreadFeedback}
          />
          <LeftMenuListItem
            to="/notifications"
            text={tn('notifications')}
            icon={<Icon icon={iconNotifications} />}
            counter={currentUser.notificationsDate ? unreadNotifications : 0}
          />
          <LeftMenuListItem
            to="/team"
            text={tn('team')}
            icon={<Icon icon={iconTeam} />}
          />
          <LeftMenuListItem
            to="/settings"
            text={tn('settings')}
            icon={<Icon icon={iconSettings} />}
            isHide={!currentUser.isAdmin}
          />
          <hr className="bf-LeftMenuList-hr" />
          <LeftMenuListItem
            href="/logout"
            text={tn('logout')}
            icon={<Icon icon={iconLogout} />}
            onClick={this.onLogout}
          />
        </ul>
        <a
          href={`https://support.butterfly.ai/userguide-${currentUser.role}.pdf`}
          className="bf-LeftMenu-bottomLink"
          target="_blank"
        >
          {tn('userguide')}
        </a>
      </div>
    )
  }
}

export default connect(mapStateToProps, null, null, { pure: false })(LeftMenu)
