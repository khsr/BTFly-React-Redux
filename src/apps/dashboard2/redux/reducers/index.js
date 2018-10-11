import { combineReducers } from 'redux'
import win from '../../utils/window'
import groups from './groups'
import { ui } from './ui'
import notifications from './notifications'
import currentCompany from './currentCompany'
import { currentUser, users } from './users'
import { boxes } from './boxes'
import { replies } from './replies'
import { chats, messages } from './messages'
import { notes } from './notes'
import { teamUsers } from './teamUsers'
import { teamTags } from './teamTags'
import { mood } from './mood'
import { moodNotes } from './moodNotes'

export default combineReducers({
  ui,
  notifications,
  users,
  groups,
  currentUser,
  currentCompany,
  isSmall,
  boxes,
  replies,
  chats,
  messages,
  notes,
  teamUsers,
  teamTags,
  mood,
  moodNotes
})

function isSmall (state = win.isSmall, action) {
  switch (action.type) {
    case 'RESIZE': return win.isSmall
    default: return state
  }
}
