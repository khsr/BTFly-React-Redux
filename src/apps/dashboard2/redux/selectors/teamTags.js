import { createSelector } from '../../utils/performance'
import { values } from 'lodash'
import { getMappedGroups } from './team'

export const getSearch = state => state.teamTags.search
export const getSortColumn = state => state.teamTags.sort
export const getSelection = state => state.teamTags.selection

export const getCleanSearch = createSelector(
  [getSearch],
  function getCleanSearch (term) { return term.trim().toLowerCase() }
)

const getMappedGroupsList = createSelector(
  [getMappedGroups],
  function getMappedGroupsList (groups) { return values(groups) }
)

export const getFilteredGroups = createSelector(
  [getMappedGroupsList, getCleanSearch],
  function getFilteredGroups (groups, term) {
    return groups.filter(group => group.name.toLowerCase().includes(term))
  }
)

export const getSortedGroups = createSelector(
  [getFilteredGroups, getSortColumn],
  function getSortedGroups (groups, column) {
    return groups.sort((g1, g2) => {
      if (g1[column] < g2[column]) return -1
      if (g1[column] > g2[column]) return 1
      return 0
    })
  }
)

export const getAccessibleGroupsList = createSelector(
  [getMappedGroupsList],
  function getAccessibleGroupsList (groups) { return groups.filter(group => !group.isDisabled) }
)

export const getSelectedGroupsList = createSelector(
  [getMappedGroups, getSelection],
  function getSelectedGroupsList (groups, selection) { return Object.keys(selection).map(id => groups[id]).filter(value => value) }
)
