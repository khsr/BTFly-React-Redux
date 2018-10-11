import React, { Component } from 'react'
import { connect } from '../../utils/performance'
import { updateCurrentUser } from '../../redux/actions/users'
import { showNewMessage } from '../../utils/intercom'
import { ProfilePicturePopup } from './ProfilePicturePopup'
import { TrialMessage } from './TrialMessage'
import { TrialPopup } from './TrialPopup'
import { WelcomePopup } from './WelcomePopup'
import t from '../../../../utils/locales'

const mapStateToProps = ({ currentUser, currentCompany }) => {
  const isFirstLogin = currentUser.firstLoginAt === currentUser.lastLoginAt
  return {
    userName: currentUser.fullName,
    picture: currentUser.picture,
    trialEnds: currentCompany.trialEnds,
    isAdmin: currentUser.isAdmin,
    isFirstLogin,
    isProfilePicturePopupShown: !isFirstLogin && !currentUser.hasPicture,
    isWelcomePopupShown: isFirstLogin && !currentUser.hasPicture,
    isTrialMessageShown: Date.now() > currentCompany.trialStartsEnding && Date.now() < currentCompany.trialEnds,
    isTrialPopupShown: Date.now() > currentCompany.trialEnds
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateCurrentUser (attrs) { return dispatch(updateCurrentUser(attrs)) },
    onTrialUpgrade (e) {
      e.preventDefault()
      showNewMessage(t('dashboard.popups.intercom-upgrade-text'))
    }
  }
}

class Popups extends Component {
  render () {
    const { userName, isProfilePicturePopupShown, isWelcomePopupShown, isTrialMessageShown,
    isTrialPopupShown, trialEnds, isAdmin, updateCurrentUser, onTrialUpgrade } = this.props
    return (
      <noscript>
        <ProfilePicturePopup
          userName={userName}
          isShown={isProfilePicturePopupShown}
          updateCurrentUser={updateCurrentUser}
        />
        <WelcomePopup
          userName={userName}
          isShown={isWelcomePopupShown}
          updateCurrentUser={updateCurrentUser}
        />
        <TrialPopup
          isAdmin={isAdmin}
          isShown={isTrialPopupShown}
          onTrialUpgrade={onTrialUpgrade}
        />
        <TrialMessage
          userName={userName}
          trialEnds={trialEnds}
          isShown={isTrialMessageShown}
          onTrialUpgrade={onTrialUpgrade}
        />
      </noscript>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Popups)
