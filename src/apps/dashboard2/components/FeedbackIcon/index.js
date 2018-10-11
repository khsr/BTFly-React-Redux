import React from 'react'
import { Icon, colorifyIcon } from '../Icon'
import iconThumbUp from './iconThumbUp.svg?raw'
import iconThumbDown from './iconThumbDown.svg?raw'
import iconThumbUpDown from './iconThumbUpDown.svg?raw'
import iconStar1 from './iconStar1.svg?raw'
import iconStar2 from './iconStar2.svg?raw'
import iconStar3 from './iconStar3.svg?raw'
import iconStar4 from './iconStar4.svg?raw'
import iconStar5 from './iconStar5.svg?raw'
import iconSmileyHappy from './iconSmileyHappy.svg?raw'
import iconSmileyNeutral from './iconSmileyNeutral.svg?raw'
import iconSmileyUnhappy from './iconSmileyUnhappy.svg?raw'
import iconNone from './iconNone.svg?raw'

export const FeedbackIcon = ({ type, value, isWhite, isGrey6, isSmall, isMedium }) => {
  let icon = ''
  if (value === null) {
    icon = iconNone
  } else if (type === 'rating') {
    icon = getStarIcon({ isWhite, isGrey6, value })
  } else if (type === 'smileys') {
    icon = value === -1
      ? iconSmileyUnhappy
      : (value === 0 ? iconSmileyNeutral : iconSmileyHappy)
  } else if (type === 'yesno') {
    icon = value === 0 ? iconThumbUpDown : ((value === 1 || value === true) ? iconThumbUp : iconThumbDown)
  }
  return <Icon isSmall={isSmall} isMedium={isMedium} isWhite={isWhite} html={icon} />
}

function getStarIcon ({ value, isWhite, isGrey6 }) {
  const icon = (value < 1.5 ? iconStar1 : (value < 2.5 ? iconStar2 : (value < 3.5 ? iconStar3 : (value < 4.5 ? iconStar4 : iconStar5))))
  return isWhite
  ? colorifyIcon(icon, '#FFFFFF', '#FFDC00')
  : (isGrey6 ? colorifyIcon(icon, '#AEAEAE', '#FFDC00') : icon)
}
