import { combineReducers } from 'redux'
import { ZOOM_OPTIONS } from '../../config'
import { CHANGE_ZOOM, RESET_ZOOM } from '../actions/mood'

const initialStateZoom = ZOOM_OPTIONS[0]

export const mood = combineReducers({ zoom })

function zoom (state = initialStateZoom, action) {
  switch (action.type) {
    case CHANGE_ZOOM: {
      const { scale } = action.payload
      return scale
    }
    case RESET_ZOOM: return initialStateZoom
    default: return state
  }
}
