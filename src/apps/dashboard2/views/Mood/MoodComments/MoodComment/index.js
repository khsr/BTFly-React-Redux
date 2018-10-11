import React, { PureComponent } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import memoize from 'fast-memoize'
import { Icon, IconCircleChecked } from '../../../../components/Icon'
import { Spinner } from '../../../../components/Spinner'
import { MoodDriverIcon } from '../../../../components/MoodDriverIcon'
import { parseBody, getReplyValue } from '../../../../../../utils/replies-utils'
import { formatDateTime } from '../../../../utils/moment'
import { makeCancelable } from '../../../../../../utils/promise'
import { ReplyIcon } from '../../../../views/Chat/ReplyIcon'
import { CommentDefailsItem } from '../../../../views/Chat/Comment'
import { namespace } from '../../../../../../utils/locales'
import IconEmptyChat from './iconEmptyChat.svg?react'
import './index.css'
const tn = namespace('dashboard.mood')

const getDetails = (moodComments, moodDetails, subFilters) => {
  return Object.keys(moodComments).map(type => {
    return {
      isActive: subFilters && subFilters.includes(type),
      DriverIcon: <MoodDriverIcon driverType={type} />,
      score: `${moodDetails[type]}/5`,
      text: moodComments[type]
    }
  })
}

export class MoodComment extends PureComponent {
  constructor () {
    super()
    const memoizedGetDetails = memoize(getDetails)
    this.details = () => {
      const { reply: { moodComments, moodDetails }, subFilters } = this.props
      return moodComments ? memoizedGetDetails(moodComments, moodDetails, subFilters) : []
    }
  }

  handleNotifyClick = () => {
    const { reply: { _id }, onNotify } = this.props
    return onNotify(_id)
  }

  handleResolveClick = () => {
    const { reply: { _id }, boxId, onResolve } = this.props
    return onResolve({ replyId: _id, boxId })
  }

  render () {
    const details = this.details()
    const { isAdmin, isNew, isNotified, canBeNotified, isNeedsYourAttention, isResolved, userName, reply, hasOtherChats, messagesCount, boxId, isUnread } = this.props
    const commentClassName = classNames('bf-MoodComment', {
      'is-new': isNew,
      'is-needs-your-attention': isNeedsYourAttention
    })
    const iconClassName = classNames('bf-MoodCommentIcon', {
      'is-new': isNew,
      'is-needs-your-attention': isNeedsYourAttention
    })
    return (
      <div className="bf-MoodCommentWrapper">
        <div className={iconClassName}>
          <ReplyIcon boxType="mood" value={getReplyValue(reply, 'mood')} />
          <div className="bf-MoodCommentIcon-arrow" />
        </div>
        <div className={commentClassName}>
          <div className="bf-MoodComment-content">
            <div className="bf-MoodComment-content-date">
              {userName ? <div className="bf-MoodComment-content-date-name">{userName}</div> : null}
              {userName ? '- ' : null}
              {formatDateTime(reply.createdAt)}
            </div>
            {reply.body ? (
              <div
                className="bf-MoodComment-content-body"
                dangerouslySetInnerHTML={{ __html: parseBody(reply.body) }}
              />
            ) : null}
            {details.length ? (
              <div className="bf-MoodComment-content-details">
                <div className="bf-MoodComment-content-details-line" />
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
          <div className="bf-MoodComment-footer">
            <MoodCommentChatButton
              replyId={reply._id}
              hasOtherChats={hasOtherChats}
              boxId={boxId}
              isUnread={isUnread}
              count={messagesCount}
            />
            {isAdmin && canBeNotified && !isNotified ? <MoodCommentNotifyButton onClick={this.handleNotifyClick} /> : null}
            {isAdmin && isNotified ? <div className="bf-MoodCommentNotifyStatus">{tn('comment-managers-notified')}</div> : null}
            {isNeedsYourAttention ? <div className="bf-MoodCommentNotifyStatus">{tn('comment-needs-attention')}</div> : null}
            <MoodCommentResolveButton isResolved={isResolved} onClick={this.handleResolveClick} />
          </div>
        </div>
      </div>
    )
  }
}

class MoodCommentChatButton extends PureComponent {
  render () {
    const { isUnread, hasOtherChats, replyId, count, boxId } = this.props
    const noChat = count === 0
    const className = classNames('bf-MoodCommentChatButton', {
      'is-empty': noChat,
      'is-unread': isUnread
    })
    const to = `/mood/${boxId}/chats/${replyId}`
    return (
      <Link className={className} to={to}>
        <span className="bf-MoodCommentChatButton-title">{noChat ? tn('comment-chat-with-user') : tn('comment-chat')}</span>
        {noChat ? null : <span className="bf-MoodCommentChatButton-counter">{count}</span>}
        {noChat ? <div className="bf-MoodCommentChatButton-noChat">
          <Icon icon={IconEmptyChat} />
          {hasOtherChats ? <div /> : null}
        </div> : null}
      </Link>
    )
  }
}

class MoodCommentNotifyButton extends PureComponent {
  constructor () {
    super()
    this.state = { isLoading: false }
  }

  handleClick = (e) => {
    e.preventDefault()
    if (this.state.isLoading) return

    const promise = this.props.onClick()
    if (!(promise instanceof Promise)) return
    this.submitPromise = makeCancelable(promise)

    const cb = () => this.setState({ isLoading: false })
    this.setState({ isLoading: true })
    this.submitPromise.promise.then(cb)
    this.submitPromise.promise.catch(cb)
  }

  componentWillUnmount () {
    if (this.submitPromise) this.submitPromise.cancel()
  }

  render () {
    const { isLoading } = this.state
    const className = classNames('bf-MoodCommentNotifyButton', {
      'is-loading': isLoading
    })
    return (
      <div className={className} onClick={this.handleClick}>
        {tn('comment-notify-managers')}
        {isLoading ? <Spinner isCenter /> : null}
      </div>
    )
  }
}

class MoodCommentResolveButton extends PureComponent {
  constructor () {
    super()
    this.state = { isLoading: false }
  }

  handleClick = (e) => {
    e.preventDefault()
    const { onClick, isResolved } = this.props
    if (isResolved || this.state.isLoading) return

    const promise = onClick()
    if (!(promise instanceof Promise)) return
    this.submitPromise = makeCancelable(promise)

    const cb = () => this.setState({ isLoading: false })
    this.setState({ isLoading: true })
    this.submitPromise.promise.then(cb)
    this.submitPromise.promise.catch(cb)
  }

  componentWillUnmount () {
    if (this.submitPromise) this.submitPromise.cancel()
  }

  render () {
    const { isResolved } = this.props
    const { isLoading } = this.state
    const className = classNames('bf-MoodCommentResolveButton', {
      'is-resolved': isResolved,
      'is-loading': isLoading
    })
    return (
      <div className={className} onClick={this.handleClick}>
        {isResolved ? tn('comment-resolved') : tn('comment-resolve')}
        {isLoading ? <Spinner /> : <IconCircleChecked />}
      </div>
    )
  }
}
