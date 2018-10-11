import React from 'react'
import { IconUser } from '../../../components/Icon'
import { MoodIcon } from '../../../components/MoodIcon'
import { FeedbackIcon } from '../../../components/FeedbackIcon'

export const ReplyIcon = ({ boxType, value }) => {
  return boxType === 'mood' ? (
    <MoodIcon isMedium moodValue={value} />
  ) : (
    boxType === 'polls'
    ? <IconUser isMedium isWhite />
    : <FeedbackIcon isWhite={boxType === 'yesno'} isMedium type={boxType} value={value} />
  )
}
