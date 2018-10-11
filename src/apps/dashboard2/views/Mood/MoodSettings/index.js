import React, { Component } from 'react'
import memoize from 'fast-memoize'
import { isDev } from '../../../utils/env'
import moment from '../../../utils/moment'
import countDelay from '../../../utils/count-delay'
import { Modal } from '../../../components/Modal'
import { FormInput } from '../../../components/FormInput'
import { FormButton } from '../../../components/FormButton'
import { FormToggler } from '../../../components/FormToggler'
import { InfoCallout } from '../../../components/InfoCallout'
import { namespace } from '../../../../../utils/locales'
import { SUPPORTED_TIMEZONES } from '../../../config'
import './index.css'
const tn = namespace('dashboard.mood')
const tf = namespace('dashboard.feedback')

const timezones = getTimezonesList().map(tz => {
  return { key: tz, name: moment.tz(tz).format('z Z') }
})

function getHoursList (timezone, { hours, minutes } = {}) {
  const list = [
    { key: 10, name: '10 AM - 10:00' },
    { key: 16, name: '4 PM - 16:00' }
  ]
  if (hours && minutes !== 0 && ![10, 16].includes(hours)) {
    const d = moment.tz(new Date(), timezone).startOf('day')
    .add(hours, 'hours')
    .add(minutes, 'minutes')
    list.push({ key: hours, name: d.format('h A - HH:mm') })
  }
  return list
}

let everyList = [
  { key: 'thursday', name: tn('settings-every-thursday') },
  { key: 'other thursday', name: tn('settings-other-thursday') },
  { key: 'last thursday', name: tn('settings-last-thursday') }
]
if (isDev) everyList.push({ key: 'day', name: tn('settings-every-day') })

export class MoodSettings extends Component {
  constructor (props) {
    super(props)
    this._memoGetHoursList = memoize(getHoursList)

    const { isEmpty, currentCompany } = props
    const { moodSettings, isMoodSet } = currentCompany
    this.isDefaultCheck = isEmpty || isMoodSet || false
    this.isDefaultShare = !moodSettings.every ? true : moodSettings.share
    this.changed = [] // track changed properties
    this.state = {
      isCheck: this.isDefaultCheck,
      isShare: this.isDefaultShare,
      isDisabled: !isEmpty,
      every: moodSettings.every || 'thursday',
      hours: moodSettings.hours || 16,
      minutes: moodSettings.minutes || 0,
      timezone: getCurrentTimezone(moodSettings.timezone),
      isLoading: false
    }
    this.state.nextRequest = this.getTimerText()
    this.interval = setInterval(() => {
      this.setState({ nextRequest: this.getTimerText() })
    }, 1000)
  }

  toggleCheck = () => {
    const isCurrentlyCheck = !this.state.isCheck
    this.setState({
      isCheck: isCurrentlyCheck,
      isDisabled: this.checkDisabled('isCheck', this.isDefaultCheck !== isCurrentlyCheck),
      nextRequest: this.getTimerText()
    })
  }

  toggleShare = () => {
    const isCurrentlyShare = !this.state.isShare
    this.setState({
      isShare: isCurrentlyShare,
      isDisabled: this.checkDisabled('isShare', this.isDefaultCheck !== isCurrentlyShare)
    })
  }

  onEveryChange = ({ value, isChanged }) => {
    this.setState({
      every: value,
      isDisabled: this.checkDisabled('every', isChanged),
      nextRequest: this.getTimerText()
    })
  }

  onHoursChange = ({ value, isChanged }) => {
    this.setState({
      hours: value,
      minutes: 0,
      isDisabled: this.checkDisabled('hours', isChanged),
      nextRequest: this.getTimerText()
    })
  }

  handleTimeZoneChange = ({ value, isChanged }) => {
    this.setState({
      timezone: value,
      isDisabled: this.checkDisabled('timezone', isChanged),
      nextRequest: this.getTimerText()
    })
  }

  onSubmit = () => {
    const { every, hours, minutes, timezone, isCheck, isShare } = this.state
    const { saveMoodSettings, onClose } = this.props
    this.setState({ isLoading: true })
    return saveMoodSettings({ every, hours, minutes, timezone, share: isShare }, isCheck).then(() => onClose())
  }

  checkDisabled = (prop, isChanged) => {
    const { isEmpty } = this.props
    this.changed = isChanged ? [prop].concat(this.changed) : this.changed.filter(p => p !== prop)
    return !isEmpty && this.changed.length === 0
  }

  getTimerText = () => {
    const { every, hours, minutes, timezone } = this.state
    const delay = countDelay({ every, hours, minutes, timezone })
    const duration = moment.duration(delay)
    return `${duration.days()}${tf('timer-day')} ${duration.hours()}${tf('timer-hour')} ${duration.minutes()}${tf('timer-minute')} ${duration.seconds()}${tf('timer-second')}`
  }

  getHoursList = () => {
    const { timezone } = this.state
    const { moodSettings } = this.props.currentCompany
    return this._memoGetHoursList(timezone, moodSettings)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  render () {
    const { onClose, isEmpty } = this.props
    const { isCheck, isShare, isDisabled, isLoading, every, hours, nextRequest, timezone } = this.state
    const hoursList = this.getHoursList()
    const headerIcon = isEmpty ? null : <FormToggler isGrey isCheck={isCheck} onToggle={this.toggleCheck} />
    const footer = (
      <div className="bf-MoodSettings-footer">
        <div className="bf-MoodSettings-footer-share">
          <FormToggler isDisabled={!isCheck} isCheck={isShare} onToggle={this.toggleShare} />
          <span>{tn('settings-share-text')}</span>
          <InfoCallout text={tn('settings-share-tooltip')} />
        </div>
        <FormButton
          isButton
          isLarge
          text={tn('settings-ok')}
          icon="next"
          onClick={this.onSubmit}
          isLoading={isLoading}
          isDisabled={isDisabled}
        />
      </div>
    )
    return (
      <Modal
        isLarge
        isHeaderGrey={!isCheck}
        headerIcon={headerIcon}
        title={tn('settings-title')}
        footer={footer}
        onSubmit={this.onSubmit}
        onClose={onClose}
      >
        <div className="bf-MoodSettings">
          <div className="bf-MoodSettings-title">
            {tn('settings-text')}
          </div>
          <FormInput
            type="select"
            isDisabled={!isCheck}
            options={everyList}
            defaultValue={every}
            onChange={this.onEveryChange}
          />
          <div className="bf-MoodSettings-timeGroup">
            <FormInput
              type="select"
              isDisabled={!isCheck}
              options={hoursList}
              defaultValue={hours}
              onChange={this.onHoursChange}
            />
            <FormInput
              type="select"
              isDisabled={!isCheck}
              options={timezones}
              defaultValue={timezone}
              onChange={this.handleTimeZoneChange}
            />
          </div>
          <div className="bf-MoodSettings-nextRequest">
            <span>{tn('settings-next-request')}: <strong>{isCheck ? nextRequest : null}</strong></span>
          </div>
        </div>
      </Modal>
    )
  }
}

/**
 * Get timezones list
 *
 * @return {Array} - timezones list
 */

function getTimezonesList () {
  const currentTimezone = getCurrentTimezone()
  if (!SUPPORTED_TIMEZONES.some(tz => tz === currentTimezone)) {
    return [currentTimezone].concat(SUPPORTED_TIMEZONES)
  } else {
    return SUPPORTED_TIMEZONES
  }
}

function getCurrentTimezone (currentTimezone = moment.tz.guess()) {
  const abbrCurrentTimezone = moment.tz(currentTimezone).format('z Z')
  const supportedTimezone = SUPPORTED_TIMEZONES.find(tz => moment.tz(tz).format('z Z') === abbrCurrentTimezone)
  return supportedTimezone || currentTimezone
}
