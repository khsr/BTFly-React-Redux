import initDebug from 'debug'
import componentEmitter from 'component-emitter'
import { trailing as throttle } from '../../../utils/throttle'
const debug = initDebug('bf:utils/window')

const win = componentEmitter({
  get height () { return window.innerHeight },
  get width () { return window.innerWidth },
  get isSmall () { return win.width <= 600 },
  get isMedium () { return win.width <= 1024 }
})

/**
 * Handle `resize` event.
 */

window.addEventListener('resize', throttle(() => {
  debug('resize %sx%s', win.height, win.width)
  win.emit('resize')
}))

/**
 * Export `win` object.
 */

export default win
