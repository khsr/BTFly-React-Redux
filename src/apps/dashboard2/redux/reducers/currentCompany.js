import { fromJS } from 'immutable'
import { bootstrap } from '../../../../components/boot'
import { TRIAL_DAYS, TRIAL_DAYS_TO_DISPLAY_MESAGE } from '../../config'
import moment from '../../utils/moment'
import { startCase } from 'lodash'
import { initRecord } from '../immutable-utils'

const timeDiff = Date.now() - bootstrap.startTime // normalize with local time
const trialStartedAt = (bootstrap.company.trialStartedAt || Date.now()) + timeDiff // support trialStartedAt=null

class Company extends initRecord(['name', 'subdomain', 'language', 'moodSettings',
  'moodJobId', 'timezone', 'auth', 'slack']) {
  get fullName () {
    return this.get('name') || startCase(this.get('subdomain'))
  }

  get moodSettings () {
    return this.get('moodSettings') ? this.get('moodSettings').toObject() : {}
  }

  get auth () {
    return this.get('auth') ? this.get('auth').toObject() : {}
  }

  get isMoodSet () {
    return this.get('moodSettings') && this.get('moodJobId')
  }

  get trialStartsEnding () {
    return moment(trialStartedAt).add(TRIAL_DAYS_TO_DISPLAY_MESAGE, 'days').valueOf()
  }

  get trialEnds () {
    return moment(trialStartedAt).add(TRIAL_DAYS, 'days').valueOf()
  }

  get isSlackEnabled () {
    return !!this.get('slack')
  }

  get isMoodShareEnabled () {
    return !!this.moodSettings.share
  }
}

const initialState = new Company(fromJS(bootstrap.company))

export default function currentCompany (state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_CURRENT_COMPANY': return state.merge(fromJS(action.attrs))
    default: return state
  }
}
