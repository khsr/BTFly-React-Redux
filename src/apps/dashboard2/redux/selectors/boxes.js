import { createSelector } from '../../utils/performance'
import { filterActive } from '../data-utils'

export const getBoxes = state => state.boxes
export const getActiveBoxes = createSelector(getBoxes, function getActiveBoxes (boxes) {
  return filterActive(boxes)
})
export const getMoodBoxes = createSelector(getActiveBoxes, function getMoodBoxes (boxes) {
  return boxes
  .filter((b) => b.type === 'mood')
  .sortBy((b) => b.createdAt)
})
export const getFeedbackBoxes = createSelector(getActiveBoxes, function getFeedbackBoxes (boxes) {
  return boxes
  .filter((b) => b.type !== 'mood')
  .sortBy((b) => -(b.scheduledAt || b.createdAt))
})
export const getMoodBoxesList = createSelector(getMoodBoxes, function getMoodBoxesList (boxes) {
  return boxes.toArray()
})
export const getQuestionsByBox = createSelector(getMoodBoxes, function getQuestionsByBox (boxes) {
  return boxes.map(box => box.questions.toJS())
})
