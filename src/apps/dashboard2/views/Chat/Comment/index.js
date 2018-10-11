import React from 'react'
import { FeedbackIcon } from '../../../components/FeedbackIcon'
import { MoodDriverIcon } from '../../../components/MoodDriverIcon'
import { formatDateTime } from '../../../utils/moment'
import { parseBody, getReplyValue, getPollType } from '../../../../../utils/replies-utils'
import { ChatButton } from '../ChatButton'
import { ChatIcons } from '../ChatIcons'
import { ReplyIcon } from '../ReplyIcon'
import './index.css'

export const Comment = ({ isNew, boxType, userName, reply, chatButton, subFilters, otherChats }) => {
  let details = []
  if (reply.moodComments && Object.keys(reply.moodComments).length) {
    details = Object.keys(reply.moodComments).map((type) => {
      return {
        isActive: subFilters && subFilters.includes(type),
        DriverIcon: <MoodDriverIcon driverType={type} />,
        score: `${reply.moodDetails[type]}/5`,
        text: reply.moodComments[type]
      }
    })
  }
  if (boxType === 'polls') {
    details = reply.polls.map((poll) => {
      const pollType = getPollType(poll)
      const pollValue = getReplyValue(poll, pollType)
      return {
        DriverIcon: <FeedbackIcon isSmall isGrey6 type={pollType} value={pollValue} />,
        text: poll.body
      }
    })
  }
  return (
    <div>
      <div className="bf-CommentIcon">
        <ReplyIcon
          boxType={boxType}
          value={getReplyValue(reply, boxType)}
        />
        <div className={`bf-CommentIcon-arrow${isNew ? ' is-new' : ''}`} />
      </div>
      <div className={`bf-Comment${isNew ? ' is-new' : ''}`}>
        <div className="bf-Comment-content">
          <div className="bf-Comment-content-date">
            {userName ? <div className="bf-Comment-content-date-name">{userName}</div> : null}
            {userName ? '- ' : null}
            {formatDateTime(reply.createdAt)}
          </div>
          {reply.body ? (
            <div
              className="bf-Comment-content-body"
              dangerouslySetInnerHTML={{ __html: parseBody(reply.body) }}
            />
          ) : null}
          {details.length ? (
            <div className="bf-Comment-content-details">
              <div className="bf-Comment-content-details-line" />
              {details.map(({ isActive, DriverIcon, score, text }, index) => {
                return (
                  <CommentDefailsItem
                    key={index}
                    DriverIcon={DriverIcon}
                    isActive={isActive}
                    text={text}
                    score={score}
                  />
                )
              })}
            </div>
          ) : null}
        </div>
        <div className="bf-Comment-chat">
          {otherChats && otherChats.length ? <ChatIcons chats={otherChats} /> : null}
          {chatButton ? (
            <ChatButton
              replyId={reply._id}
              prefix={chatButton.prefix}
              isUnread={chatButton.isUnread}
              count={chatButton.messagesCount}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}

export const CommentDefailsItem = ({ DriverIcon, isActive, text, score }) => {
  return (
    <div className={`bf-CommentDetailsItem${isActive ? ' is-active' : ''}`}>
      {DriverIcon}
      {score ? (
        <div className="bf-CommentDetailsItem-score">
          {score}
        </div>
      ) : null}
      <div
        className="bf-CommentDetailsItem-text"
        dangerouslySetInnerHTML={{ __html: parseBody(text) }}
      />
    </div>
  )
}
