import React from 'react'
import { formatDateTime } from '../../../utils/moment'
import { parseBody } from '../../../../../utils/replies-utils'
import './index.css'

export const ChatMessage = ({ isReceiver, createdAt, name, icon, body }) => {
  return (
    <div className="bf-ChatMessage">
      <div className={`bf-ChatMessage-icon${isReceiver ? ' is-receiver' : ''}`}>
        {typeof icon === 'string'
        ? <div className="bf-ChatMessage-icon-image" style={{ backgroundImage: `url(${icon})` }} />
        : <div className="bf-ChatMessage-icon-image">{icon}</div>}
        <div className="bf-ChatMessage-icon-arrow" />
      </div>
      <div className="bf-ChatMessage-content">
        {name ? (
          <div className="bf-ChatMessage-content-name">
            {name}
          </div>
        ) : null}
        <div className="bf-ChatMessage-content-date">
          {name ? '- ' : null}
          {typeof createdAt === 'string' ? createdAt : formatDateTime(createdAt)}
        </div>
        <div
          className="bf-ChatMessage-content-body"
          dangerouslySetInnerHTML={{ __html: parseBody(body) }}
        />
      </div>
    </div>
  )
}
