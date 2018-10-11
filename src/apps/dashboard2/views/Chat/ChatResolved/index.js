import React from 'react'
import { assetsHost } from '../../../../../components/boot'
import t from '../../../../../utils/locales'

const defaultPicture = `${assetsHost}/default-image.v2.jpg`

export const ChatResolved = ({ name, picture }) => {
  return (
    <div className="bf-Chat-body-resolvedBy">
      <img src={picture || defaultPicture} />
      <span>{t('dashboard.mood.chat-reply-is-resolved', { name })}</span>
    </div>
  )
}
