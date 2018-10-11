import { bootstrap } from '../../../../components/boot'
import { initRecord, create, update, updateMany, init } from '../immutable-utils'

class Chat extends initRecord(['boxId', 'replyId', 'managerId']) {}
class Message extends initRecord(['chatId', 'senderIndex', 'body', 'status']) {}

const defaultMessages = init(bootstrap.messages, Message)
const defaultChats = init(bootstrap.chats, Chat)

export function messages (state = defaultMessages, action) {
  switch (action.type) {
    case 'CREATE_MESSAGE': return create(state, action, Message)
    case 'UPDATE_MESSAGE': return update(state, action)
    case 'UPDATE_MESSAGES': return updateMany(state, action)
    default: return state
  }
}

export function chats (state = defaultChats, action) {
  switch (action.type) {
    case 'CREATE_CHAT': return create(state, action, Chat)
    default: return state
  }
}
