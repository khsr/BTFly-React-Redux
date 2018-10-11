import { combineReducers } from 'redux'
import { PUSH_TEMP_NOTE, POP_TEMP_NOTE } from '../actions/moodNotes'

const initialStateTempQueue = {}

export const moodNotes = combineReducers({ tempQueue })

function tempQueue (state = initialStateTempQueue, action) {
  switch (action.type) {
    case PUSH_TEMP_NOTE: {
      const { tempNote, boxId } = action.payload
      const boxNotes = state[boxId] || []
      return { ...state, [boxId]: boxNotes.concat(tempNote) }
    }
    case POP_TEMP_NOTE: {
      const { boxId, tempNoteId } = action.payload
      const boxNotes = state[boxId] || []
      return { ...state, [boxId]: boxNotes.filter(note => note._id !== tempNoteId) }
    }
    default: return state
  }
}
