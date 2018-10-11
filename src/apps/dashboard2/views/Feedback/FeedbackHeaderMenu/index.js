import React from 'react'
import { HeaderMenu } from '../../../components/HeaderMenu'
import { IconReport, IconComments } from '../../../components/Icon'
import { namespace } from '../../../../../utils/locales'
const tn = namespace('dashboard.feedback')

export const FeedbackHeaderMenu = ({ isReport, currentBox }) => {
  const to = `/feedback/${currentBox._id}`
  return (
    <HeaderMenu
      items={[
        {
          to,
          title: tn('header-report'),
          icon: <IconReport />,
          isActive: isReport,
          notificationCounter: currentBox.unreadReplies.length
        }, {
          to: `${to}/comments`,
          title: tn('header-comments'),
          icon: <IconComments />,
          isActive: !isReport,
          notificationCounter: currentBox.unreadComments.length + currentBox.unreadMessages.length
        }
      ]}
    />
  )
}
