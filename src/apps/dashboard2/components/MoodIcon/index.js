import React, { PureComponent } from 'react'
import { Icon } from '../Icon'
import icon1 from './icon1.svg?react'
import icon2 from './icon2.svg?react'
import icon3 from './icon3.svg?react'
import icon4 from './icon4.svg?react'
import icon5 from './icon5.svg?react'
import iconNone from './iconNone.svg?react'

export const noneColor = '#CCCCCC'
export const moodColors = ['#F45D6F', '#F98371', '#FFA76C', '#AEEA7E', '#34EB7E']

export class MoodIcon extends PureComponent {
  render () {
    const { bfIndex, moodValue } = this.props
    const icon = typeof bfIndex !== 'undefined' ? getMoodIconByBfIndex(bfIndex) : getMoodIconByValue(moodValue)
    return <Icon {...this.props} icon={icon} />
  }
}

export function getMoodIconByBfIndex (bfIndex) {
  if (bfIndex === null) return iconNone
  if (bfIndex < 2) return icon1
  if (bfIndex < 4) return icon2
  if (bfIndex < 6) return icon3
  if (bfIndex < 8) return icon4
  if (bfIndex <= 10) return icon5
}

export function getMoodIconByValue (moodValue) {
  if (moodValue === 1) return icon1
  if (moodValue === 2) return icon2
  if (moodValue === 3) return icon3
  if (moodValue === 4) return icon4
  if (moodValue === 5) return icon5
}

export function getMoodColorByBfIndex (bfIndex) {
  if (bfIndex === null) return noneColor
  if (bfIndex < 2) return moodColors[0]
  if (bfIndex < 4) return moodColors[1]
  if (bfIndex < 6) return moodColors[2]
  if (bfIndex < 8) return moodColors[3]
  if (bfIndex <= 10) return moodColors[4]
}
