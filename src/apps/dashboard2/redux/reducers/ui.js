import { combineReducers } from 'redux'
import { OPEN_GET_FEEDBACK, CLOSE_GET_FEEDBACK } from '../actions/ui'

const initialStateGetFeedback = { isOpen: false, opts: {} }

export const ui = combineReducers({ getFeedback })

function getFeedback (state = initialStateGetFeedback, action) {
  switch (action.type) {
    case OPEN_GET_FEEDBACK: return { ...state, isOpen: true, opts: action.payload }
    case CLOSE_GET_FEEDBACK: return initialStateGetFeedback
    default: return state
  }
}
