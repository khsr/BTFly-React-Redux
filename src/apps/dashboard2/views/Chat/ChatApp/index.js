import React, { Component } from 'react'
import { tail } from 'lodash'
import fastdom from 'fastdom'
import { leading as throttle } from '../../../../../utils/throttle'
import { getBoxType, getReplyValue } from '../../../../../utils/replies-utils'
import { CloseButton } from '../../../components/CloseButton'
import { ReplyIcon } from '../ReplyIcon'
import { ChatMessage } from '../ChatMessage'
import { Comment } from '../Comment'
import { ChatIcons } from '../ChatIcons'
import { ChatResolveButton } from '../ChatResolveButton'
import { ChatResolved } from '../ChatResolved'
import { FormTextareaAutosize } from '../../../components/FormTextarea'
import { namespace } from '../../../../../utils/locales'
import { MARK_AS_READ_TIMEOUT } from '../../../config'
import './index.css'
const tn = namespace('dashboard.feedback')

const unreadMessageSelector = ({ myIndex }) => message => !message.status && message.senderIndex !== myIndex

export class ChatApp extends Component {
  constructor () {
    super()
    this.state = { value: '', isDisabled: true, isTyping: false, messages: [], unreadedMessageIndex: null }
    this.typingTimeout = null
  }

  sendTyping = throttle(() => {
    const { chatId, onTyping } = this.props
    if (chatId) return onTyping({ chatId })
  })

  onMessageCreate = (e) => {
    e.preventDefault()
    const { value, isDisabled } = this.state
    const { chatId, onCreateChat, onCreateMessage, myIndex } = this.props
    if (isDisabled) return
    const cleanValue = value.trim()
    const tempMessage = { body: cleanValue, senderIndex: myIndex, createdAt: tn('chat-now') }
    const tailMessages = () => this.setState({ messages: tail(this.state.messages) })
    this.setState({ value: '', isDisabled: true, messages: [tempMessage] })
    if (chatId) {
      onCreateMessage({ chatId, body: cleanValue })
      .then(() => tailMessages())
    } else {
      if (!this.chatPromise) this.chatPromise = onCreateChat()
      this.chatPromise = this.chatPromise
      .then(() => onCreateMessage({ chatId: this.props.chatId, body: cleanValue }))
      .then(() => tailMessages())
    }
  }

  onTyping = () => {
    if (this.typingTimeout) clearTimeout(this.typingTimeout)
    this.setState({ isTyping: true })
    this.typingTimeout = setTimeout(() => {
      this.typingTimeout = null
      this.setState({ isTyping: false })
    }, 1500)
  }

  onInputChange = (e) => {
    const value = e.target.value
    this.setState({ value, isDisabled: !value.trim().length })
    this.sendTyping()
  }

  fillPadding = () => {
    const { $body, $messages, $padder } = this.refs
    fastdom.measure(() => {
      $padder.style.paddingTop = 0
      const diff = $body.clientHeight - $messages.clientHeight
      // 2.5 - height of typing block, 2rem - padding-top
      $padder.style.paddingTop = diff > 45 ? `calc(${diff}px - 4.5rem)` : 0
      $body.scrollTop = 1000000
    })
  }

  handleUnreadedMessages () {
    const { chatMessages, myIndex } = this.props
    const firstUnreadedMessageIndex = chatMessages.findIndex(unreadMessageSelector({ myIndex }))
    if (!firstUnreadedMessageIndex) return

    this.setState({ unreadedMessageIndex: firstUnreadedMessageIndex })
    this.markAsReadedTimeout = setTimeout(() => {
      this.setState({ unreadedMessageIndex: null })
      this.markAsReadedTimeout = null
    }, MARK_AS_READ_TIMEOUT)
  }

  handleResolve = () => {
    return this.props.onResolve()
  }

  componentWillMount () {
    this.handleUnreadedMessages()
  }

  componentDidMount () {
    this.componentDidUpdate({}, {})
  }

  componentDidUpdate ({ chatMessages }, { messages }) {
    if (chatMessages && messages &&
      chatMessages.length === this.props.chatMessages.length &&
      messages.length === this.state.messages.length) {
      return
    }
    const { chatId, onMarkMessagesAsRead, myIndex } = this.props
    const isThereUnreadedMessages = this.props.chatMessages.some(unreadMessageSelector({ myIndex }))
    if (isThereUnreadedMessages) {
      onMarkMessagesAsRead({ chatId })
    }

    this.refs.$input.focus()
    this.fillPadding()
  }

  componentWillUnmount () {
    if (this.markAsReadedTimeout) clearTimeout(this.markAsReadedTimeout)
    if (this.typingTimeout) clearTimeout(this.typingTimeout)
  }

  render () {
    const { myIndex, managerPicture, userName, chatMessages, chatId, reply, box, otherChats, canBeResolved, resolvedByManager } = this.props
    const { value, isDisabled, isTyping, messages, unreadedMessageIndex } = this.state
    const boxType = getBoxType(box)
    const isReplyResolved = !!reply.resolvedAt
    const showResolveButton = canBeResolved && myIndex === 0 && !isReplyResolved

    return (
      <div className="bf-ChatWrapper">
        <div className="bf-Chat">
          {showResolveButton ? <ChatResolveButton onClick={this.handleResolve} /> : null}
          {myIndex === 0 ? (
            <div className="bf-Chat-closeButton">
              <CloseButton isGreen onClose={this.props.redirectToComments} />
            </div>
          ) : null}
          <div className="bf-Chat-body" ref="$body">
            <div ref="$padder" />
            <div ref="$messages">
              <div className="bf-Chat-body-comment">
                <Comment
                  userName={myIndex === 0 ? userName : tn('chat-you')}
                  boxType={boxType}
                  reply={reply}
                />
              </div>
              {otherChats && otherChats.length ? (
                <div className="bf-Chat-body-chattingManagers">
                  <ChatIcons chats={otherChats} />
                  <span>{tn('chat-chatting-managers')}</span>
                </div>
              ) : null}
              {chatMessages.concat(messages).map(({ status, createdAt, senderIndex, body }, index) => (
                <div key={index}>
                  {index === unreadedMessageIndex
                    ? <div className="bf-Chat-body-unreadedLine">
                      <div />
                      <span>{tn('chat-new-messages')}</span>
                    </div>
                  : null}
                  <ChatMessage
                    isReceiver={senderIndex !== 0}
                    icon={senderIndex === 0 ? managerPicture : <ReplyIcon
                      boxType={boxType}
                      value={getReplyValue(reply, boxType)}
                    />}
                    name={senderIndex === myIndex ? tn('chat-you') : userName}
                    createdAt={createdAt}
                    body={body}
                  />
                </div>
              ))}
              {resolvedByManager ? <ChatResolved name={resolvedByManager.name} picture={resolvedByManager.picture} /> : null}
            </div>
            <div className="bf-Chat-body-typing" style={{ visibility: isTyping ? 'visible' : 'hidden' }}>
              {tn('chat-typing', { userName })}
            </div>
          </div>
          <form className="bf-Chat-form" onSubmit={this.onMessageCreate}>
            <FormTextareaAutosize
              ref="$input"
              maxRows={4}
              onSubmit={this.onMessageCreate}
              onHeightChange={this.fillPadding}
              value={value}
              onChange={this.onInputChange}
            />
            <button onClick={this.onMessageCreate} disabled={isDisabled}>
              {!chatId ? tn('start-chat') : tn('chat-send')}
            </button>
          </form>
        </div>
      </div>
    )
  }
}
