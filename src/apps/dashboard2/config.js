import { isDev } from './utils/env'

export const MARK_AS_READ_TIMEOUT = 1500
export const TEAM_USERS_PAGINATOR_OPTIONS = [25, 50, 100, 250]
export const TEAM_RECORDS_PER_PAGE = 25
export const TRIAL_DAYS = 30
export const TRIAL_DAYS_TO_DISPLAY_MESAGE = 14
export const MAX_UPLOAD_PICTURE_SIZE = 4194304
const baseZoomOptions = ['1week', '2weeks', '1month', '2months', '6months', '1year']
export const ZOOM_OPTIONS = isDev ? ['1day'].concat(baseZoomOptions) : baseZoomOptions
export const SUPPORTED_TIMEZONES = [
  'Europe/London', 'Europe/Paris',
  'America/New_York', 'America/Chicago', 'America/Los_Angeles'
]
export const MANAGERS_NUMBER_FOR_REPLY_NOTIFICATION = 2
