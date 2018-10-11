import { createSelector } from '../../utils/performance'
import { filterActive } from '../../redux/data-utils'

export const getGroups = state => state.groups
export const getActiveGroups = createSelector(
  [getGroups],
  function getActiveGroups (groups) { return filterActive(groups) }
)
