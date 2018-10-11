import React from 'react'
import { HeaderMenu } from '../../../components/HeaderMenu'
import { IconReport, IconComments } from '../../../components/Icon'
import { namespace } from '../../../../../utils/locales'
const tn = namespace('dashboard.mood')

export const MoodHeaderMenu = ({ isReport, currentBoxId, currentUser, unreadNotes, unreadComments }) => {
  const href = `/mood/${currentBoxId}`
  return (
    <HeaderMenu
      items={[
        {
          to: currentUser.isManager ? `${href}/yourteam` : href,
          title: tn('header-report'),
          icon: <IconReport />,
          notificationCounter: unreadNotes,
          isActive: isReport
        }, {
          to: `${href}/comments`,
          title: tn('header-comments'),
          icon: <IconComments />,
          notificationCounter: unreadComments,
          isActive: !isReport
        }
      ]}
    />
  )
}
