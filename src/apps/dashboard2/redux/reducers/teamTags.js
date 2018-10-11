import { combineReducers } from 'redux'
import {
  CHANGE_SEARCH, RESET_SEARCH,
  CHANGE_SORT_COLUMN, RESET_SORT_COLUMN,
  CHANGE_SELECTION, RESET_SELECTION
} from '../actions/teamTags'

const initialStateSearch = ''
const initialStateSort = 'name'
const initialStateSelection = {}

export const teamTags = combineReducers({
  search,
  sort,
  selection
})

function search (state = initialStateSearch, action) {
  switch (action.type) {
    case CHANGE_SEARCH: return action.payload
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

function selection (state = initialStateSelection, action) {
  switch (action.type) {
    case CHANGE_SELECTION: return action.payload
    case RESET_SELECTION: return initialStateSelection
    default: return state
  }
}
