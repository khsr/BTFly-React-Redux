import React, { Component } from 'react'
import { ChartDrivers } from '../../../components/ChartDrivers'
import { MoodDriversHeatMap } from './MoodDriversHeatMap'
import { MoodDriversLabels } from './MoodDriversLabels'
import { namespace } from '../../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.mood')

export class MoodDrivers extends Component {
  constructor () {
    super()
    this.state = { isDetails: false }
  }

  toggleDetails = () => {
    this.setState({ isDetails: !this.state.isDetails })
  }

  render () {
    const { currentBox, currentBoxIndex, currentBoxes, isSmall } = this.props
    const { isDetails } = this.state
    const previousBoxes = []
    void [4, 3, 2, 1].forEach((prevSub) => {
      if (currentBoxes[currentBoxIndex - prevSub]) {
        previousBoxes.push(currentBoxes[currentBoxIndex - prevSub])
      }
    })
    const isEmpty = !currentBox.drivers && previousBoxes.every((b) => !b.drivers)

    return (
      <div className="bf-MoodDrivers">
        <div className="bf-MoodDrivers-title">
          {tn('report-mood-drivers')}
          {!isEmpty ? (
            <button type="button" onClick={this.toggleDetails}>
              {isDetails ? tn('report-hide-details') : tn('report-show-details')}
            </button>
          ) : null}
        </div>
        {!isDetails ? (
          <div className="bf-MoodDrivers-body">
            <ChartDrivers
              isSmall={isSmall}
              drivers={currentBox.drivers}
              previousDrivers={previousBoxes.map(b => b.drivers)}
            />
            <MoodDriversLabels hasPrev />
          </div>
        ) : (
          <div className="bf-MoodDrivers-body">
            <MoodDriversHeatMap currentBox={currentBox} isSmall={isSmall} />
          </div>
        )}
      </div>
    )
  }
}
