import { omit } from 'lodash'

export const ASSIGN_LATEST_UPLOAD = 'teamUsers/ASSIGN_LATEST_UPLOAD'
export const RESET_LATEST_UPLOAD = 'teamUsers/RESET_LATEST_UPLOAD'
export const CHANGE_SEARCH_FILTER = 'teamUsers/CHANGE_SEARCH_FILTER'
export const CHANGE_SEARCH_TERM = 'teamUsers/CHANGE_SEARCH_TERM'
export const RESET_SEARCH = 'teamUsers/RESET_SEARCH'
export const CHANGE_SORT_COLUMN = 'teamUsers/CHANGE_SORT_COLUMN'
export const RESET_SORT_COLUMN = 'teamUsers/RESET_SORT_COLUMN'
export const CHANGE_PAGE = 'teamUsers/CHANGE_PAGE'
export const CHANGE_RECORDS_PER_PAGE = 'teamUsers/CHANGE_RECORDS_PER_PAGE'
export const RESET_PAGINATION = 'teamUsers/RESET_PAGINATION'
export const CHANGE_USERS_SELECTION = 'teamUsers/CHANGE_USERS_SELECTION'
export const RESET_USERS_SELECTION = 'teamUsers/RESET_USERS_SELECTION'

export function assignLatestUpload (users) {
  return dispatch => {
    if (users.length > 1) dispatch({ type: RESET_LATEST_UPLOAD })
    return dispatch({
      type: ASSIGN_LATEST_UPLOAD,
      payload: users.map(user => user._id)
    })
  }
}

export function changeSearchTerm (term) {
  return {
    type: CHANGE_SEARCH_TERM,
    payload: term
  }
}

export function changeSearchFilter (filter) {
  return {
    type: CHANGE_SEARCH_FILTER,
    payload: filter
  }
}

export function resetSearch () {
  return {
    type: RESET_SEARCH
  }
}

export function changeSortColumn (column) {
  return {
    type: CHANGE_SORT_COLUMN,
    payload: column
  }
}

export function resetSortColumn () {
  return {
    type: RESET_SORT_COLUMN
  }
}

export function changePage (page) {
  return {
    type: CHANGE_PAGE,
    payload: page
  }
}

export function changeRecordsPerPage (recordsPerPage) {
  return {
    type: CHANGE_RECORDS_PER_PAGE,
    payload: recordsPerPage
  }
}

export function resetPagination () {
  return {
    type: RESET_PAGINATION
  }
}

export function toggleSelection (userId, selected) {
  return (dispatch, getState) => {
    const { teamUsers: { selection } } = getState()
    let usersIds = null
    if (!selected) {
      usersIds = { ...selection, [userId]: true }
    } else {
      usersIds = omit(selection, userId)
    }
    return dispatch({
      type: CHANGE_USERS_SELECTION,
      payload: usersIds
    })
  }
}

export function changeSelection (users) {
  return (dispatch, getState) => {
    const { teamUsers: { selection } } = getState()
    let usersIds = null
    if (Object.keys(selection).length === users.length) {
      usersIds = {}
    } else {
      usersIds = users.reduce((result, id) => { result[id] = true; return result }, {})
    }
    return dispatch({
      type: CHANGE_USERS_SELECTION,
      payload: usersIds
    })
  }
}

export function resetSelection () {
  return {
    type: RESET_USERS_SELECTION
  }
}
