import React, { Component } from 'react'
import { router } from '../../routes'
import { ChatButton } from './ChatButton'
import { Comment } from './Comment'
import { connect } from '../../utils/performance'
import { hideIntercomContainer, showIntercomContainer } from '../../utils/intercom'
import { getChatForReplyAndUser, getMessagesForChat } from '../../redux/data-utils'
import { subscribe } from '../../utils/socket'
import { createChat, createMessage, markMessagesAsRead, sendTyping } from '../../redux/actions/chats'
import { resolve } from '../../redux/actions/replies'
import { ChatApp } from './ChatApp'
import { namespace } from '../../../../utils/locales'
const tn = namespace('dashboard.feedback')

const mapStateToProps = ({ users, currentUser, boxes, chats, replies, messages }, { boxId, replyId }) => {
  const box = boxes.get(boxId)
  const reply = replies.get(replyId)
  if (!box || !reply) return { isRedirect: true }
  const replyUser = users.get(reply.userId)
  const chat = getChatForReplyAndUser(chats, reply, currentUser)
  const chatMessages = !chat ? [] : getMessagesForChat(messages, chat).sortBy((m) => m.createdAt).toArray()
  const otherChats = chats.filter((c) => c.replyId === reply._id && c.managerId !== currentUser._id)
  .toArray().map((c) => {
    const manager = users.get(c.managerId)
    return {
      ...c,
      managerPicture: manager && manager.picture,
      managerName: manager && manager.fullName
    }
  })
  const resolvedByManager = reply.resolvedBy ? users.get(reply.resolvedBy) : null

  return {
    box,
    reply,
    chatMessages,
    chatId: chat ? chat._id : null,
    userName: replyUser ? replyUser.fullName : tn('anonymous-user'),
    managerPicture: currentUser.picture,
    resolvedByManager: resolvedByManager && { name: resolvedByManager.fullName, picture: resolvedByManager.picture },
    otherChats
  }
}

const mapDispatchToProps = (dispatch, { boxId, replyId }) => {
  return {
    onCreateChat () {
      return dispatch(createChat({ boxId, replyId }))
    },
    onMarkMessagesAsRead ({ chatId }) {
      return dispatch(markMessagesAsRead({ chatId }))
    },
    onCreateMessage ({ chatId, body }) {
      return dispatch(createMessage({ chatId, body }))
    },
    onTyping ({ chatId }) {
      return dispatch(sendTyping({ chatId }))
    },
    onResolve () {
      return dispatch(resolve({ boxId, replyId }))
    }
  }
}

class Chat extends Component {
  redirectToComments = () => {
    const { closePath } = this.props
    router.push(closePath)
  }

  unsubscribeFromSocket = subscribe('typing', () => {
    this.refs.chat.onTyping()
  }, (e) => {
    const { chatId } = this.props
    return chatId && e.chatId === chatId
  })

  componentDidMount () {
    hideIntercomContainer()
  }

  componentWillUnmount () {
    this.unsubscribeFromSocket()
    showIntercomContainer()
  }

  render () {
    const { isRedirect } = this.props
    if (isRedirect) return this.redirectToComments()
    return (
      <ChatApp
        ref="chat"
        myIndex={0}
        redirectToComments={this.redirectToComments}
        {...this.props}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat)
export { Comment, ChatButton }
