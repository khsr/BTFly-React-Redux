import request from '../../utils/request'

export const updateCurrentCompany = (attrs) => {
  return (dispatch, getState) => {
    return request('/api/admin/company', 200, { method: 'put', body: attrs })
    .then((e) => {
      if (attrs.language && attrs.language !== getState().currentCompany.language) {
        location.reload()
      } else {
        dispatch({ type: 'UPDATE_CURRENT_COMPANY', attrs: e.data })
      }
    })
  }
}

export const updateMoodSettings = (moodSettings) => {
  return (dispatch) => {
    return request('/api/admin/company/update-mood-settings', 200, { method: 'put', body: { moodSettings } })
    .then((e) => {
      dispatch({ type: 'UPDATE_CURRENT_COMPANY', attrs: e.data })
    })
  }
}

export const disableMoodSettings = () => {
  return (dispatch) => {
    return request('/api/admin/company/disable-mood-settings', 200, { method: 'put' })
    .then(() => {
      dispatch({ type: 'UPDATE_CURRENT_COMPANY', attrs: { moodJobId: null } })
    })
  }
}
