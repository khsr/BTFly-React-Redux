import initDebug from 'debug'
const debug = initDebug('bf:utils/intercom')

/**
 * Initialize Intercom with `attrs`.
 * http://docs.intercom.io/install-on-your-web-product/intercom-javascript-api
 *
 * @param {Object} attrs
 */

export function boot (attrs) {
  // add Intercom scripts async
  void (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',intercomSettings);}else{var d=document;var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};w.Intercom=i;function l(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/qr816ap9';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);}if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})() // eslint-disable-line

  debug('boot "%s" with %o', attrs.name, attrs)
  window.Intercom('boot', attrs)
}

/**
 * Update user `attrs` and check for new messages.
 *
 * @param {Object} attrs
 */

export function update (attrs) {
  debug('update %o', attrs)
  window.Intercom('update', attrs)
}

/**
 * Track event with `eventName` and `attrs`.
 *
 * @param {String} eventName
 * @param {Object} attrs
 */

export function track (eventName, attrs = {}) {
  debug('track "%s" with %o', eventName, attrs)
  window.Intercom('trackEvent', eventName, attrs)
}

/**
 * Format date for intercom.
 *
 * @param {Number} createdAt
 * @return {Number}
 */

export function formatDate (createdAt) {
  return Math.floor(createdAt / 1000)
}

/**
 * Hide #intercom-container.
 */

export function hideIntercomContainer () {
  const $intercom = document.getElementById('intercom-container')
  if ($intercom) {
    $intercom.style.display = 'none'
  } else if (typeof window.Intercom === 'undefined') {
    setTimeout(() => {
      hideIntercomContainer()
    }, 3000)
  }
}

/**
 * Show #intercom-container.
 */

export function showIntercomContainer () {
  const $intercom = document.getElementById('intercom-container')
  if ($intercom) $intercom.style.display = 'initial'
}

export function showNewMessage (text) {
  if (typeof window.Intercom === 'undefined') {
    setTimeout(() => showNewMessage(text), 500)
  } else {
    window.Intercom('showNewMessage', text)
  }
}
