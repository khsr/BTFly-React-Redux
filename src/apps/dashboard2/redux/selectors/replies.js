import { createSelector } from '../../utils/performance'
import { filterUnread } from '../../redux/data-utils'

export const getReplies = state => state.replies
export const getRepliesByBox = createSelector(
  [getReplies],
  function getRepliesByBox (replies) { return replies.groupBy(r => r.boxId) }
)

export const getUnreadRepliesByBox = createSelector(
  [getRepliesByBox],
  function getUnreadRepliesByBox (repliesByBox) {
    return repliesByBox.map(replies => filterUnread(replies))
  }
)
