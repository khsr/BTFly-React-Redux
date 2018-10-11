import request from '../../utils/request'

export function createBox ({ isAnonymous, isAll, groupIds, polls, timezone, schedule }) {
  const display = ['reply']
  const hasPolls = polls.length > 1
  if (isAnonymous) display.push('anonymous')
  if (isAll) display.push('all')
  if (!hasPolls) display.push(polls[0].type)
  const body = {
    name: polls[0].text,
    display,
    groupIds,
    imageUrl: hasPolls ? null : polls[0].imageUrl,
    type: hasPolls ? 'polls' : null,
    polls: hasPolls ? polls : null,
    timezone,
    schedule
  }
  return (dispatch) => {
    return request('/api/boxes', 201, { method: 'post', body })
    .then((e) => dispatch({ type: 'CREATE_BOX', attrs: e.data }))
  }
}

export function updateBoxStatus ({ boxId, status }) {
  return (dispatch) => {
    return request(`/api/boxes/${boxId}`, 200, { method: 'put', body: { status } })
    .then((e) => dispatch({ type: 'UPDATE_BOX', attrs: e.data }))
  }
}

export function deleteBox ({ boxId }) {
  return (dispatch) => {
    return request(`/api/boxes/${boxId}`, 200, { method: 'delete' })
    .then((e) => dispatch({ type: 'UPDATE_BOX', attrs: e.data }))
  }
}

export function resendBox ({ boxId, questionIds }) {
  return (dispatch) => {
    return request(`/api/boxes/${boxId}/resend`, 200, { method: 'put', body: { questionIds } })
    .then((e) => dispatch({ type: 'UPDATE_BOX', attrs: e.data }))
  }
}

export function markAsRead ({ boxId, replyIds, timeout }) {
  return (dispatch) => {
    return request(`/api/boxes/${boxId}/replies/mark-as-read`, 200, { method: 'put', body: { replyIds } })
    .then(e => new Promise(resolve => {
      const callback = () => resolve(dispatch({ type: 'UPDATE_REPLIES', attrs: e.data }))
      setTimeout(callback, timeout || 0)
    }))
  }
}

export function markBoxAsSeen ({ boxId, timeout }) {
  return (dispatch) => {
    return request(`/api/boxes/${boxId}/mark-as-seen`, 200, { method: 'put' })
    .then(e => new Promise(resolve => {
      const callback = () => resolve(dispatch({ type: 'UPDATE_BOX', attrs: e.data }))
      setTimeout(callback, timeout || 0)
    }))
  }
}

export function markNotesAsSeen ({ boxId, timeout }) {
  return (dispatch) => {
    return request(`/api/boxes/${boxId}/notes/mark-as-seen`, 200, { method: 'put' })
    .then(e => new Promise(resolve => {
      const callback = () => resolve(dispatch({ type: 'UPDATE_BOX', attrs: e.data }))
      setTimeout(callback, timeout || 0)
    }))
  }
}

export function shareMoodResults ({ boxId }) {
  return (dispatch) => {
    return request(`/api/boxes/${boxId}/share-mood-results`, 200, { method: 'put' })
    .then((e) => dispatch({ type: 'UPDATE_BOX', attrs: e.data }))
  }
}
