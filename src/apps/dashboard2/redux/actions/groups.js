import request from '../../utils/request'

export function createGroup ({ isAdmin, name, userId, moodTracking, instantFeedback }) {
  return (dispatch) => {
    const url = `/api/${isAdmin ? 'admin' : 'manager'}/groups`
    const body = { name, moodTracking, instantFeedback, managerId: isAdmin ? null : userId }
    return request(url, 201, { method: 'post', body }).then((e) => {
      dispatch({ type: 'CREATE_GROUP', attrs: e.data })
    })
  }
}

export function updateGroup ({ groupId, name, moodTracking, instantFeedback, isAdmin }) {
  return (dispatch) => {
    const url = `/api/${isAdmin ? 'admin' : 'manager'}/groups/${groupId}`
    return request(url, 200, { method: 'put', body: { name, moodTracking, instantFeedback } }).then((e) => {
      dispatch({ type: 'UPDATE_GROUP', attrs: e.data })
    })
  }
}

export function deleteGroup ({ groupId, isAdmin }) {
  return (dispatch) => {
    const url = `/api/${isAdmin ? 'admin' : 'manager'}/groups/${groupId}`
    return request(url, 200, { method: 'delete' }).then((e) => {
      dispatch({ type: 'UPDATE_GROUP', attrs: e.data }) // update deletedAt
    })
  }
}

export function deleteGroups ({groupIds, isAdmin}) {
  return (dispatch) => {
    const url = `/api/${isAdmin ? 'admin' : 'manager'}/delete-groups`
    return request(url, 200, { method: 'put', body: { groupIds } }).then((e) => {
      dispatch({ type: 'UPDATE_GROUPS', attrs: e.data })
    })
  }
}
