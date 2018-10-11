import React from 'react'
import { Popup, PopupTitle, PopupMessage } from '../Popup'
import { PopupButton } from '../PopupButton'
import { IconUp } from '../../../components/Icon'
import { namespace } from '../../../../../utils/locales'
const tn = namespace('dashboard.popups.trial-modal')

export const TrialPopup = ({ isAdmin, isShown, onTrialUpgrade }) => {
  if (!isShown) return null
  return (
    <Popup isLogo>
      <PopupTitle title={tn('title')} subTitle={tn('sub-title')} />
      <PopupMessage text={isAdmin ? tn('message-admin') : tn('message-manager')} />
      {isAdmin ? (
        <PopupButton
          title={tn('upgrade-account')}
          icon={<IconUp />}
          onClick={onTrialUpgrade}
        />
      ) : null}
    </Popup>
  )
}
