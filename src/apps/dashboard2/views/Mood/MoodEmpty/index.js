import React from 'react'
import { Logo } from '../../../components/Logo'
import { FormButton } from '../../../components/FormButton'
import { Icon } from '../../../components/Icon'
import iconGuy from './iconGuy.svg?react'
import { namespace } from '../../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.mood')

export const MoodEmpty = ({ isManager, adminEmail, openSettingsModal }) => {
  return (
    <div className="bf-MoodEmpty">
      <div className="bf-MoodEmpty-header">
        <Icon icon={iconGuy} />
        <Logo isLarge />
        <h2>{tn('empty-logo-title')}</h2>
      </div>
      <div className="bf-MoodEmpty-body">
        <p className="bf-MoodEmpty-body-text is-title">{tn('empty-title')}</p>
        <p className="bf-MoodEmpty-body-text is-subtitle" dangerouslySetInnerHTML={{ __html: tn('empty-subtitle') }} />
        <p className="bf-MoodEmpty-body-text">{tn('empty-text')}</p>
        <p className="bf-MoodEmpty-body-text is-boldGreen">{tn('empty-text-areas')}</p>

        {!isManager ? (
          <FormButton
            isButton
            isLarge
            icon="next"
            text={tn('empty-send')}
            onClick={openSettingsModal}
          />
        ) : (
          <div
            className="bf-MoodEmpty-body-managerNote"
            dangerouslySetInnerHTML={{ __html: tn('empty-manager-note', { adminEmail }) }}
          />
        )}

        <div className="bf-MoodEmpty-body-footNote">
          {tn('empty-anonymous')}
        </div>
      </div>
    </div>
  )
}
