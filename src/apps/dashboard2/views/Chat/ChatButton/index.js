import React from 'react'
import { Link } from 'react-router'
import t from '../../../../../utils/locales'
import './index.css'

export const ChatButton = ({ isUnread, prefix, replyId, count }) => {
  const noChat = count === 0
  const className = `bf-ChatButton${noChat ? ' is-empty' : ''}${isUnread ? ' is-unread' : ''}`
  const to = `${prefix}/chats/${replyId}`
  return (
    <Link className={className} to={to}>
      {t('dashboard.feedback.replies-chat')}
      {noChat ? null : <span>{count}</span>}
    </Link>
  )
}
