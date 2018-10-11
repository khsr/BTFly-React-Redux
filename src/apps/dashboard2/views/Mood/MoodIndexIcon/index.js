import React, { PureComponent } from 'react'
import { MoodIcon, getMoodColorByBfIndex } from '../../../components/MoodIcon'
import { MoodDriverIcon } from '../../../components/MoodDriverIcon'

export class MoodIndexIcon extends PureComponent {
  render () {
    const { isSmall, isMedium, bfIndex, driver } = this.props
    return driver === 'mood'
    ? <MoodIcon isSmall={isSmall} isMedium={isMedium} bfIndex={bfIndex} />
    : <MoodDriverIcon isSmall={isSmall} isMedium={isMedium} color={getMoodColorByBfIndex(bfIndex)} driverType={driver} />
  }
}
