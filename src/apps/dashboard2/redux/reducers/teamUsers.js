import { combineReducers } from 'redux'
import {
  ASSIGN_LATEST_UPLOAD, RESET_LATEST_UPLOAD,
  CHANGE_SEARCH_FILTER, CHANGE_SEARCH_TERM, RESET_SEARCH,
  CHANGE_SORT_COLUMN, RESET_SORT_COLUMN,
  CHANGE_PAGE, CHANGE_RECORDS_PER_PAGE, RESET_PAGINATION,
  CHANGE_USERS_SELECTION, RESET_USERS_SELECTION
} from '../actions/teamUsers'
import { TEAM_RECORDS_PER_PAGE } from '../../config'

const initialStateLatestUpload = {}
const initialStateSearch = {
  term: '',
  filter: 'all'
}
const initialStateSort = 'fullName'
const initialStatePagination = {
  recordsPerPage: TEAM_RECORDS_PER_PAGE,
  page: 1
}
const initialStateSelection = {}

export const teamUsers = combineReducers({
  latestUpload,
  search,
  sort,
  pagination,
  selection
})

function latestUpload (state = initialStateLatestUpload, action) {
  switch (action.type) {
    case RESET_LATEST_UPLOAD: return initialStateLatestUpload
    case ASSIGN_LATEST_UPLOAD: {
      const ids = action.payload.reduce((result, id) => {
        result[id] = true
        return result
      }, {})
      return {
        ...state,
        ...ids
      }
    }
    default: return state
  }
}

function search (state = initialStateSearch, action) {
  switch (action.type) {
    case CHANGE_SEARCH_FILTER: return { ...state, filter: action.payload }
    case CHANGE_SEARCH_TERM: return { ...state, term: action.payload }
    case RESET_SEARCH: return initialStateSearch
    default: return state
  }
}

function sort (state = initialStateSort, action) {
  switch (action.type) {
    case CHANGE_SORT_COLUMN: return action.payload
    case RESET_SORT_COLUMN: return initialStateSort
    default: return state
  }
}

function pagination (state = initialStatePagination, action) {
  switch (action.type) {
    case CHANGE_PAGE: return { ...state, page: action.payload }
    case CHANGE_RECORDS_PER_PAGE: return { ...state, recordsPerPage: action.payload }
    case RESET_PAGINATION: return initialStatePagination
    default: return state
  }
}

function selection (state = initialStateSelection, action) {
  switch (action.type) {
    case CHANGE_USERS_SELECTION: return action.payload
    case RESET_USERS_SELECTION: return initialStateSelection
    default: return state
  }
}
