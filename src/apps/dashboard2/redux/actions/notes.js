import request from '../../utils/request'

export function createNote ({ boxId, body }) {
  return (dispatch) => {
    return request(`/api/boxes/${boxId}/notes`, 201, { method: 'post', body: { body } })
    .then((e) => dispatch({ type: 'CREATE_NOTE', attrs: e.data }))
  }
}

export function updateNote ({ noteId, body }) {
  return (dispatch) => {
    return request(`/api/notes/${noteId}`, 200, { method: 'put', body })
    .then((e) => dispatch({ type: 'UPDATE_NOTE', attrs: e.data }))
  }
}
