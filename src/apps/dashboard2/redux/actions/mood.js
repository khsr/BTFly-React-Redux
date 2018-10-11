export const CHANGE_ZOOM = 'MOOD/CHANGE_ZOOM'
export const RESET_ZOOM = 'MOOD/RESET_ZOOM'

export function changeZoom (scale) {
  return {
    type: CHANGE_ZOOM,
    payload: { scale }
  }
}

export function resetZoom () {
  return {
    type: RESET_ZOOM
  }
}
