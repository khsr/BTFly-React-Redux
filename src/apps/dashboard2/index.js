import React from 'react'
import AppContainer from './components/AppContainer'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import sEmitter from 'storage-emitter'
import { store } from './redux'
import { Router } from 'react-router'
import * as intercomEvents from './utils/intercom-events'
import { subscribe } from './utils/socket'
import t from '../../utils/locales'
import { bootstrap } from '../../components/boot'
import { createRoutes, router } from './routes'
import './index.css'

// Profiling React
// Chrome extension https://github.com/crysislinux/chrome-react-perf
// API documentation https://facebook.github.io/react/docs/perf.html
if (process.env.NODE_ENV !== 'production') window.Perf = require('react-addons-perf')
// call Perf.start() to start profiling
// interact with application
// call Perf.stop() to stop.profiling
// now you can get reports

// manage login/logout cycle

const { currentUser } = store.getState()
sEmitter.emit('login', currentUser._id)
sEmitter.on('login', (userId) => { if (userId !== currentUser._id) location.reload() })
sEmitter.on('logout', () => setTimeout(() => location.reload(), 500)) // refresh page on logout
subscribe('session-disabled', () => location.reload())

// manage application version changes

subscribe('version', ({ version }) => {
  if (version === bootstrap.version) return
  if (window.confirm(t('dashboard.new-version-confirmation'))) location.reload()
}, () => true)

// render layout

const $root = document.getElementById('root')
const renderView = (Routes) => {
  render(
    <AppContainer>
      <Provider store={store}>
        <Router history={router} routes={Routes} />
      </Provider>
    </AppContainer>,
    $root
  )
}
renderView(createRoutes({ store }))

if (module.hot) {
  module.hot.accept('./routes', () => {
    const NextRoutes = require('./routes').createRoutes({ store })
    renderView(NextRoutes)
  })
}

// init Intercom

intercomEvents.boot(bootstrap)
