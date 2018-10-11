import request from '../../utils/request'
import { requestHost } from '../../../../utils/request'
import { assignLatestUpload } from './teamUsers'

export const updateCurrentUser = (attrs) => {
  return (dispatch) => {
    const requestUpdateUser = () => {
      return request('/api/user', 200, { method: 'put', body: attrs })
      .then((e) => {
        dispatch({ type: 'UPDATE_CURRENT_USER', attrs: e.data })
      })
    }
    const changePasswordAndRequestUpdateUser = () => {
      if (attrs.password) {
        return request('/api/user/change-password', 200, { method: 'put', body: { password: attrs.password } }).then(() => {
          delete attrs.password
          if (Object.keys(attrs).length) return requestUpdateUser()
        })
      }
      return requestUpdateUser()
    }
    if (attrs.imageSrc) {
      return request('/api/upload', 201, { method: 'post', body: { base64Data: attrs.imageSrc } })
      .then((res) => {
        delete attrs.imageSrc
        attrs.picture = res.url
        return changePasswordAndRequestUpdateUser()
      })
    }
    return changePasswordAndRequestUpdateUser()
  }
}

export const updateNotificationsDate = ({ timeout }) => {
  return (dispatch) => {
    return request('/api/user/update-unread-notifications', 200, { method: 'put' })
    .then(e => new Promise(resolve => {
      const callback = () => resolve(dispatch({ type: 'UPDATE_CURRENT_USER', attrs: e.data }))
      setTimeout(callback, timeout || 0)
    }))
  }
}

export function addGroupToUser ({ userId, groupId, isAdmin }) {
  return (dispatch) => {
    const url = `/api/${isAdmin ? 'admin' : 'manager'}/users/${userId}/add-group`
    return request(url, 200, { method: 'put', body: { groupId } })
    .then((e) => dispatch({ type: 'UPDATE_USER', attrs: e.data }))
  }
}

export function removeGroupFromUser ({ userId, groupId, isAdmin }) {
  return (dispatch) => {
    const url = `/api/${isAdmin ? 'admin' : 'manager'}/users/${userId}/remove-group`
    return request(url, 200, { method: 'put', body: { groupId } })
    .then((e) => dispatch({ type: 'UPDATE_USER', attrs: e.data }))
  }
}

export function removeManagmentGroupFromUser ({ userId, groupId }) {
  return (dispatch) => {
    const url = `/api/admin/users/${userId}/remove-managment-group`
    return request(url, 200, { method: 'put', body: { groupId } })
    .then((e) => dispatch({ type: 'UPDATE_USER', attrs: e.data }))
  }
}

export function sendInvitationForUser ({ userId }) {
  const url = `/api/admin/users/${userId}/send-invitation`
  return request(url, 204, { method: 'post' })
}

export function updateUsersGroups ({ userIds, groupIds, isAdmin }) {
  return (dispatch) => {
    const url = `/api/${isAdmin ? 'admin' : 'manager'}/update-users-groups`
    return request(url, 200, { method: 'put', body: { userIds, groupIds } }).then((e) => {
      dispatch({ type: 'UPDATE_USERS', attrs: e.data })
    })
  }
}

export function uploadUsers (data) {
  return (dispatch) => {
    return requestHost('/api/admin/upload-users', { method: 'post', body: { data } })
    .then(res => Promise.all([res, res.json()]))
    .then(([ res, json ]) => {
      if (res.status === 201) return json
      if (res.status === 422) throw new Error(json.error)
      throw new Error('Sorry, unexpeted error.')
    })
    .then((json) => [
      dispatch({ type: 'CREATE_USERS', attrs: json.data }),
      dispatch(assignLatestUpload(json.data))
    ])
  }
}

export function deleteUser (userId) {
  return (dispatch) => {
    return request(`/api/admin/users/${userId}`, 200, { method: 'delete' }).then((e) => {
      dispatch({ type: 'UPDATE_USER', attrs: e.data })
    })
  }
}

export function deleteUsers (userIds) {
  return (dispatch) => {
    return request('/api/admin/delete-users', 200, { method: 'put', body: { userIds } }).then((e) => {
      dispatch({ type: 'UPDATE_USERS', attrs: e.data })
    })
  }
}

export function createUser (body) {
  return (dispatch) => {
    return request('/api/admin/users', 201, { method: 'post', body })
    .then(e => [
      dispatch({ type: 'CREATE_USER', attrs: e.data }),
      dispatch(assignLatestUpload([e.data]))
    ])
  }
}

export function updateUser (userId, body) {
  return (dispatch) => {
    return request(`/api/admin/users/${userId}`, 200, { method: 'put', body }).then((e) => {
      dispatch({ type: 'UPDATE_USER', attrs: e.data })
    })
  }
}
