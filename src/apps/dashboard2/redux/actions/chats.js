import request from '../../utils/request'

export function createChat ({ boxId, replyId }) {
  return (dispatch) => {
    return request(`/api/boxes/${boxId}/replies/${replyId}/chats`, 201, { method: 'post' }).then((e) => {
      dispatch({ type: 'CREATE_CHAT', attrs: e.data })
      return e.data
    })
  }
}

export function createMessage ({ chatId, body }) {
  return (dispatch) => {
    return request(`/api/chats/${chatId}/messages`, 201, { method: 'post', body: { body } }).then((e) => {
      dispatch({ type: 'CREATE_MESSAGE', attrs: e.data })
    })
  }
}

export function sendTyping ({ chatId }) {
  return () => {
    return request(`/api/chats/${chatId}/typing`, 204, { method: 'post' })
  }
}

export function markMessagesAsRead ({ chatId }) {
  return (dispatch) => {
    return request(`/api/chats/${chatId}/messages/mark-as-read`, 200, { method: 'put' }).then((e) => {
      dispatch({ type: 'UPDATE_MESSAGES', attrs: e.data })
    })
  }
}
