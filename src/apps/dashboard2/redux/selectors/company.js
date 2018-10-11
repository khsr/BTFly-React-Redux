import { createSelector } from '../../utils/performance'

export const getCurrentCompany = state => state.currentCompany
export const getCurrentCompanyName = createSelector(
  [getCurrentCompany],
  function (currentCompany) { return currentCompany.name }
)
