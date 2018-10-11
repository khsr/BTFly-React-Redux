import { omit } from 'lodash'

export const CHANGE_SEARCH = 'teamTags/CHANGE_SEARCH'
export const RESET_SEARCH = 'teamTags/RESET_SEARCH'
export const CHANGE_SORT_COLUMN = 'teamTags/CHANGE_SORT_COLUMN'
export const RESET_SORT_COLUMN = 'teamTags/RESET_SORT_COLUMN'
export const CHANGE_SELECTION = 'teamTags/CHANGE_TAGS_SELECTION'
export const RESET_SELECTION = 'teamTags/RESET_SELECTION'

export function changeSearch (term) {
  return {
    type: CHANGE_SEARCH,
    payload: term
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

export function toggleSelection (groupId, selected) {
  return (dispatch, getState) => {
    const { teamTags: { selection } } = getState()
    let groupIds = null
    if (!selected) {
      groupIds = { ...selection, [groupId]: true }
    } else {
      groupIds = omit(selection, groupId)
    }
    return dispatch({
      type: CHANGE_SELECTION,
      payload: groupIds
    })
  }
}

export function changeSelection (groups) {
  return (dispatch, getState) => {
    const { teamTags: { selection } } = getState()
    let groupIds = null
    if (Object.keys(selection).length === groups.length) {
      groupIds = {}
    } else {
      groupIds = groups.reduce((result, id) => { result[id] = true; return result }, {})
    }
    return dispatch({
      type: CHANGE_SELECTION,
      payload: groupIds
    })
  }
}

export function resetSelection () {
  return {
    type: RESET_SELECTION
  }
}
