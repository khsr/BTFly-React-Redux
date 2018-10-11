import request from '../../utils/request'

export function notifyManagers ({ boxId, replyId, text }) {
  return (dispatch) => {
    return request(`/api/admin/boxes/${boxId}/replies/${replyId}/notify-managers`, 201, { method: 'post', body: { text } }).then((e) => {
      dispatch({ type: 'UPDATE_REPLY', attrs: e.data })
      return e.data
    })
  }
}

export function resolve ({ boxId, replyId }) {
  return (dispatch) => {
    return request(`/api/boxes/${boxId}/replies/${replyId}/resolve`, 200, { method: 'put' }).then((e) => {
      dispatch({ type: 'UPDATE_REPLY', attrs: e.data })
      return e.data
    })
  }
}
