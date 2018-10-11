import React from 'react'
import { FormButton } from '../../../components/FormButton'
import { FormToggler } from '../../../components/FormToggler'
import { InfoCallout } from '../../../components/InfoCallout'
import { namespace } from '../../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.feedback')

export const GetFeedbackFooter = ({ isScheduled, isDisabled, isAnonymous, isDuplicate, step, sendRequest,
  incrementStep, decrementStep, toggleAnonymous, noAnonymous }) => {
  return (
    <div className="bf-GetFeedbackFooter">
      {step === 1 ? (
        <div className="bf-GetFeedbackFooter-anonymous">
          <FormToggler isDisabled={noAnonymous} isCheck={isAnonymous} onToggle={toggleAnonymous} />
          <span>{isAnonymous ? tn('anonymous-replies') : tn('identified-replies')}</span>
          <InfoCallout text={isAnonymous ? tn('response-anonymous') : tn('response-identifed')} />
        </div>
      ) : (
        <button className="bf-GetFeedbackFooter-prevButton" type="button" onClick={decrementStep}>
          {step === 3 && isDuplicate ? tn('edit') : tn('previous')}
        </button>
      )}
      <FormButton
        isButton
        isLarge
        text={(step === 3 ? (isScheduled ? tn('send-later') : tn('send-now')) : tn('next')).toUpperCase()}
        icon="next"
        isDisabled={isDisabled}
        onClick={step === 3 ? sendRequest : incrementStep}
      />
    </div>
  )
}
