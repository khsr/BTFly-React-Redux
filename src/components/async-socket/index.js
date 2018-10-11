import { assetsHost } from '../boot'
const origin = location.protocol + '//' + location.host

export default function asyncSocket (nsp = '/', opts = {}) {
  const socket = Object.seal({
    cacheEvents: [],
    io: null,

    /**
     * Set event listener for `eventName`,
     * that is cached events, while socket.io is loading.
     *
     * @param {String} eventName
     * @param {Function} fn
     * @return {Socket}
     */

    addEventListener (eventName, fn) {
      if (!socket.io) {
        socket.cacheEvents.push([eventName, fn])
      } else {
        socket.io.on(eventName, fn)
      }
      return socket
    },

    /**
     * Cancel `eventName` listener.
     *
     * @param {String} eventName
     * @return {Socket}
     */

    removeEventListener (eventName) {
      if (!socket.io) {
        socket.cacheEvents = socket.cacheEvents.filter((e) => e[0] !== eventName)
      } else {
        socket.io.off(eventName)
      }
      return socket
    }
  })

  /**
   * Async load of socket.io script.
   */

  const s = document.createElement('script')
  s.src = `${assetsHost}/socket.io-min.v135.js`
  s.async = true

  /**
   * Connect to socket.io using only long-polling.
   * Since AWS load balancer does not support sticky-sessions on TLS level.
   */

  s.onload = function initSocketIo () {
    socket.io = window.io.connect(origin + nsp, opts)
    socket.cacheEvents.forEach(([eventName, fn]) => { socket.addEventListener(eventName, fn) })
    socket.cacheEvents = []
  }

  document.body.appendChild(s)

  return socket
}
