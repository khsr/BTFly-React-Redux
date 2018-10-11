import { createSelector } from '../../utils/performance'

export const getMessages = state => state.messages
export const getMessagesByChat = createSelector(
  [getMessages],
  function getMessagesByChat (messages) { return messages.groupBy(m => m.chatId) }
)
