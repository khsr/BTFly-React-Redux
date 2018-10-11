import React, { Component } from 'react'
import { render } from 'react-dom'
import asyncSocket from '../../components/async-socket'
import sendNotification from '../../utils/send-notification'
import { ChatApp } from '../dashboard2/views/Chat/ChatApp'
import { bootstrap } from '../../components/boot'
import { requestApi, onResponseError } from '../../utils/request'
import { namespace } from '../../utils/locales'
import './index.css'

const { chatId, token, box, reply, managerName, messages, managerPicture, resolvedByManager } = bootstrap
const tn = namespace('dashboard.feedback')
const socket = asyncSocket('/', { query: `token=${token}`, upgrade: false })

class Chat extends Component {
  constructor () {
    super()
    this.state = { chatMessages: messages }

    // socket events
    socket.addEventListener('typing', this.handleTypingEvent)
    socket.addEventListener('message-created', this.handleMessageCreatedEvent)
  }

  handleTypingEvent = (e) => {
    if (e.chatId !== chatId && e.senderIndex !== 1) return
    this.refs.chat.onTyping()
  }

  handleMessageCreatedEvent = (e) => {
    const message = e.data
    if (message.chatId !== chatId) return
    if (message.senderIndex === 1) return
    this.addMessage(message)
    sendNotification(tn('chat-new-message', { userName: managerName }), {
      body: message.body,
      icon: managerPicture
    })
  }

  addMessage = (message) => {
    const newChatMessages = this.state.chatMessages.concat([message])
    this.setState({ chatMessages: newChatMessages })
  }

  // ajax methods
  onMarkMessagesAsRead = () => {
    return requestApi(`/api/chats/${chatId}/messages/mark-as-read`, { method: 'put', token })
    .catch(onResponseError)
    .then((res) => {
      if (res.status !== 200) onResponseError(res)
      return res.json().then(() => {
        const newChatMessages = this.state.chatMessages.map((m) => {
          return { ...m, status: 'read' }
        })
        this.setState({ chatMessages: newChatMessages })
      })
    })
  }

  onCreateMessage = ({ body }) => {
    return requestApi(`/api/chats/${chatId}/messages`, { method: 'post', token, body: { body } })
    .catch(onResponseError)
    .then((res) => {
      if (res.status !== 201) return onResponseError(res)
      return res.json().then((e) => {
        this.addMessage(e.data)
      })
    })
  }

  onTyping = () => {
    return requestApi(`/api/chats/${chatId}/typing`, { method: 'post', token })
    .catch(onResponseError)
    .then((res) => {
      if (res.status !== 204) onResponseError(res)
    })
  }

  render () {
    const { chatMessages } = this.state
    return (
      <ChatApp
        ref="chat"
        myIndex={1}
        chatId={chatId}
        userName={managerName}
        managerPicture={managerPicture}
        chatMessages={chatMessages}
        reply={reply}
        box={box}
        resolvedByManager={resolvedByManager}
        onMarkMessagesAsRead={this.onMarkMessagesAsRead}
        onCreateMessage={this.onCreateMessage}
        onTyping={this.onTyping}
      />
    )
  }
}

/**
 * Render Chat.
 */

render(<Chat />, document.getElementById('root'))
