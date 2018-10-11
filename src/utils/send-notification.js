import { assetsHost } from '../components/boot'

/**
 * Create an audio object or regular object with fake API.
 */

const audio = typeof window.Audio !== 'undefined'
  ? new window.Audio(`${assetsHost}/bgnotification.v1.mp3`)
  : { play () {} }

/**
 * Request permissions for notifications.
 */

if (typeof window.Notification !== 'undefined' && window.Notification.permission !== 'granted') {
  window.Notification.requestPermission()
}

/**
 * Hide notification.
 */

let currentNotification = null
let currentTimeout = null

/**
 * Play sound & send notification
 */

export default function sendNotification (title, opts = {}) {
  if (!opts.noSound) audio.play()
  if (typeof window.Notification !== 'undefined' && window.Notification.permission === 'granted') {
    if (currentNotification) {
      currentNotification.close()
      clearTimeout(currentTimeout)
    }
    currentNotification = new Notification(title, opts)
    currentTimeout = setTimeout(() => currentNotification.close(), 3000)
  }
}
