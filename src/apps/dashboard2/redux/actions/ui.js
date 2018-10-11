export const OPEN_GET_FEEDBACK = 'ui/OPEN_GET_FEEDBACK'
export const CLOSE_GET_FEEDBACK = 'ui/CLOSE_GET_FEEDBACK'

export function openGetFeedback (opts = {}) {
  return { type: OPEN_GET_FEEDBACK, payload: opts }
}

export function closeGetFeedback () {
  return { type: CLOSE_GET_FEEDBACK }
}
