import React from 'react'
import DatePicker from 'react-datepicker'
import moment from '../../../utils/moment'
import { FormCheck } from '../../../components/FormCheck'
import { namespace } from '../../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.feedback')

const times = [
  '8 AM - 08:00',
  '9 AM - 09:00',
  '10 AM - 10:00',
  '11 AM - 11:00',
  '12 PM - 12:00',
  '1 PM - 13:00',
  '2 PM - 14:00',
  '3 PM - 15:00',
  '4 PM - 16:00',
  '5 PM - 17:00',
  '6 PM - 18:00',
  '7 PM - 19:00',
  '8 PM - 20:00'
]

export const GetFeedbackStep3 = ({ polls, isAnonymous, isScheduled, isAll, groupNames,
  createScheduleToggle, scheduleDate, scheduleTime, onSetScheduleDate, onSetScheduleTime }) => {
  const hasCounter = polls.length > 1
  return (
    <div>
      <div className="bf-GetFeedbackRecap">
        <div className="bf-GetFeedbackRecap-column">
          <h4>{tn('feedback-request')}:</h4>
          {polls.map((poll, index) => {
            const type = poll.get('type')
            const text = poll.get('text')
            return (
              <div key={index} className="bf-GetFeedbackRecap-column-text">
                <span>{hasCounter ? `${index + 1}. ${text}` : text}</span>
                <small>- {tn(type === 'yesno' ? 'yesno' : (type === 'rating' ? 'rating' : 'smileys'))}</small>
              </div>
            )
          })}
        </div>
        <div className="bf-GetFeedbackRecap-column is-right">
          <h4>{tn('anonymous-replies')}:</h4>
          <div className="bf-GetFeedbackRecap-column-text">
            <span>{isAnonymous ? tn('yes') : tn('no')}</span>
          </div>
          <h4>{tn('audience')}:</h4>
          <div className="bf-GetFeedbackRecap-column-text">
            {isAll ? <span key="all">{tn('everyone')}</span> : null}
            {groupNames.map((name, index) => <span key={index}>{name}</span>)}
          </div>
        </div>
      </div>
      <div className="bf-GetFeedbackSchedule">
        <button type="button" onClick={createScheduleToggle(false)} className={`bf-GetFeedbackSchedule-item${!isScheduled ? ' is-active' : ''}`}>
          <FormCheck isRadio isChecked={!isScheduled} />
          <span>{tn('send-now')}</span>
        </button>
        <button type="button" onClick={createScheduleToggle(true)} className={`bf-GetFeedbackSchedule-item is-full${isScheduled ? ' is-active' : ''}`}>
          <FormCheck isRadio isChecked={isScheduled} />
          <span>{tn('send-later')}</span>
          <DatePicker
            className="bf-GetFeedbackDatePicker"
            selected={isScheduled ? scheduleDate : null}
            minDate={moment()}
            placeholderText={tn('set-date')}
            onChange={onSetScheduleDate}
          />
          <select className="bf-GetFeedbackTimePicker" value={isScheduled ? scheduleTime : ''} onChange={onSetScheduleTime}>
            <option value="" disabled>{tn('set-time')}</option>
            {times.map((time, index) => {
              return <option key={index} value={time}>{time}</option>
            })}
          </select>
        </button>
      </div>
    </div>
  )
}
