import { createStore, applyMiddleware, compose } from 'redux'
import reduxLogger from 'redux-logger'
import reduxThunk from 'redux-thunk'
import { webNotifications } from './middlewares/notifications'
import { subscribe } from '../utils/socket'
import { isDev } from '../utils/env'
import win from '../utils/window'
import reducers from './reducers'

/**
 * Init Store.
 */

export const middlewares = [reduxThunk, webNotifications]
if (isDev) middlewares.push(reduxLogger({ duration: true, collapsed: true }))
export const store = createStore(
  reducers, {}, compose(
    applyMiddleware(...middlewares),
    isDev && window.devToolsExtension ? window.devToolsExtension() : f => f
  )
)
if (module.hot) {
  module.hot.accept('./reducers', () => {
    const nextReducer = require('./reducers/index').default
    store.replaceReducer(nextReducer)
  })
}
if (isDev) window.store = store

/**
 * Custom events.
 */

win.on('resize', () => store.dispatch({ type: 'RESIZE' }))

/**
 * Socket events.
 */

subscribe('users-created', (e) => store.dispatch({ type: 'CREATE_USERS', attrs: e.data }))
subscribe('users-updated', (e) => store.dispatch({ type: 'UPDATE_USERS', attrs: e.data }))
subscribe('users-deleted', (e) => store.dispatch({ type: 'UPDATE_USERS', attrs: e.data }))
subscribe('user-created', (e) => store.dispatch({ type: 'CREATE_USER', attrs: e.data }))
subscribe('user-updated', (e) => {
  if (store.getState().currentUser._id === e.data._id) {
    store.dispatch({ type: 'UPDATE_CURRENT_USER', attrs: e.data })
  }
  store.dispatch({ type: 'UPDATE_USER', attrs: e.data })
})

subscribe('group-created', (e) => store.dispatch({ type: 'CREATE_GROUP', attrs: e.data }))
subscribe('group-updated', (e) => store.dispatch({ type: 'UPDATE_GROUP', attrs: e.data }))
subscribe('group-deleted', (e) => store.dispatch({ type: 'UPDATE_GROUP', attrs: e.data }))
subscribe('groups-deleted', (e) => store.dispatch({ type: 'UPDATE_GROUPS', attrs: e.data }))
subscribe('company-updated', (e) => store.dispatch({ type: 'UPDATE_CURRENT_COMPANY', attrs: e.data }))

subscribe('box-created', (e) => {
  if (store.getState().currentUser._id !== e.userId) {
    store.dispatch({ type: 'CREATE_NOTIFICATION', attrs: e })
  }
  if (e.data.type === 'mood') {
    store.dispatch({ type: 'CREATE_MOOD_BOX', attrs: e.data })
  } else if (store.getState().currentUser._id === e.userId) {
    store.dispatch({ type: 'CREATE_BOX', attrs: e.data })
  }
})
subscribe('box-updated', (e) => store.dispatch({ type: 'UPDATE_BOX', attrs: e.data }))
subscribe('reply-created', (e) => {
  if (store.getState().boxes.get(e.data.boxId)) {
    store.dispatch({ type: 'CREATE_REPLY', attrs: e.data })
  }
})
subscribe('reply-updated', (e) => {
  if (store.getState().replies.get(e.data._id)) {
    store.dispatch({ type: 'UPDATE_REPLY', attrs: e.data })
  }
})
subscribe('replies-updated', (e) => store.dispatch({ type: 'UPDATE_REPLIES', attrs: e.data }))
subscribe('chat-created', (e) => store.dispatch({ type: 'CREATE_CHAT', attrs: e.data }))
subscribe('message-created', (e) => store.dispatch({ type: 'CREATE_MESSAGE', attrs: e.data }))
subscribe('message-updated', (e) => store.dispatch({ type: 'UPDATE_MESSAGE', attrs: e.data }))
subscribe('messages-updated', (e) => store.dispatch({ type: 'UPDATE_MESSAGES', attrs: e.data }))
subscribe('note-created', (e) => store.dispatch({ type: 'CREATE_NOTE', attrs: e.data }))
subscribe('note-updated', (e) => store.dispatch({ type: 'UPDATE_NOTE', attrs: e.data }))
