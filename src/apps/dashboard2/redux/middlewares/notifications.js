import { values } from 'lodash'
import sendNotification from '../../../../utils/send-notification'
import { namespace } from '../../../../utils/locales'
import { getBoxType } from '../../../../utils/replies-utils'
import { getBoxQuestionsForUser } from '../data-utils'
import { assetsHost } from '../../../../components/boot'
const tn = namespace('dashboard.feedback')

export const webNotifications = (store) => (next) => (action) => {
  const result = next(action)
  const nextState = store.getState()
  webNotificationsActionsHooks({ nextState, action })
  return result
}

const webNotificationsActionsHooks = ({ nextState, action }) => {
  if (action.type === 'CREATE_MESSAGE') {
    const { boxes, users, replies, chats, currentUser } = nextState
    const newMessage = action.attrs
    const chat = chats.get(newMessage.chatId)
    const reply = chat ? replies.get(chat.replyId) : null
    if (!reply || chat.managerId !== currentUser._id || newMessage.senderIndex !== 1) return

    const box = boxes.get(reply.boxId)
    const user = users.get(reply.userId)
    const userName = user ? user.fullName : tn('anonymous-user')
    sendNotification(tn('chat-new-message', { userName }), {
      body: newMessage.body,
      icon: getMoodIcon(reply, getBoxType(box))
    })
  } else if (['CREATE_REPLY', 'UPDATE_REPLY'].includes(action.type)) {
    const { boxes, users, replies, currentUser } = nextState
    const { attrs: { _id, moodComments, body } } = action
    if (!moodComments || !body) return

    const reply = replies.get(_id).toJS()
    const box = boxes.get(reply.boxId)
    const user = users.get(reply.userId)
    const comments = values(reply.moodComments)
    const isEmpty = !reply.body && comments.length === 0
    if (!box || (action.type === 'UPDATE_REPLY' && isEmpty)) return
    if (currentUser.isManager) {
      const relatedQuestions = getBoxQuestionsForUser(box, currentUser)
      if (relatedQuestions.every(q => q._id !== reply.questionId)) return
    }

    const noSound = isEmpty
    const userName = user ? user.fullName : tn('anonymous-user')
    sendNotification(tn('new-reply', { userName }), {
      body: reply.body || comments.join('\n') || '',
      icon: getMoodIcon(reply, getBoxType(box)),
      noSound
    })
  }
}

/**
 * Get mood icon for notification about new `reply`.
 *
 * @param {Object|Immutable.Record} reply
 * @return {string}
 */

export function getMoodIcon (reply, boxType) {
  let icon = ''
  if (boxType === 'smileys') {
    icon = 'smiley-' + (reply.smileys === -1 ? 'unhappy' : (reply.smileys === 0 ? 'neutral' : 'happy'))
  } else if (boxType === 'rating') {
    icon = `rating-${reply.rating}`
  } else if (boxType === 'yesno') {
    icon = 'thumbs-' + (reply.yesno ? 'up' : 'down')
  } else if (boxType === 'mood') {
    icon = `mood-${reply.mood}`
  }
  return icon ? `${assetsHost}/mood-icons/${icon}.v1.png` : `${assetsHost}/default-image.v2.jpg`
}
