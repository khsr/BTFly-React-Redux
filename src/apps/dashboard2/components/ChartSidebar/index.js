import React, { Component, PureComponent, PropTypes } from 'react'
import { MoodIcon } from '../MoodIcon'
import './index.css'

export class ChartSidebar extends PureComponent {
  static propTypes = {
    isEmpty: PropTypes.bool.isRequired,
    isPercentage: PropTypes.bool,
    value: PropTypes.number,
    prevValue: PropTypes.number,
    prevLabel: PropTypes.string.isRequired
  }

  render () {
    const { isEmpty, value, isPercentage, prevValue, prevLabel } = this.props
    const suffix = isEmpty || value === prevValue || prevValue === null
    ? 'is-neutral'
    : (value > prevValue ? 'is-up' : 'is-down')

    return (
      <div className="bf-ChartSidebar">
        <div className={`bf-ChartSidebar-arrow ${suffix}`} />
        <div className="bf-ChartSidebar-text">
          {prevLabel}:<span>{prevValue === null ? '-' : `${prevValue}${isPercentage ? '%' : ''}`}</span>
        </div>
      </div>
    )
  }
}

export class ChartMoodsSidebar extends Component {
  static propTypes = {
    isEmpty: PropTypes.bool.isRequired,
    isTransparent: PropTypes.bool,
    moods: PropTypes.array.isRequired
  }

  shouldComponentUpdate ({ moods }) {
    return this.props.moods.some((val, index) => val !== moods[index])
  }

  render () {
    const { isEmpty, isTransparent, moods } = this.props
    return (
      <div className={`bf-ChartSidebar${isTransparent ? ' is-transparent' : ''}`}>
        {[5, 4, 3, 2, 1].map((moodValue, index) => {
          return (
            <div key={index} className="bf-ChartSidebar-smiley">
              {<MoodIcon isSmall moodValue={moodValue} />}
              <span>• {isEmpty ? '-' : moods[4 - index]}</span>
            </div>
          )
        })}
      </div>
    )
  }
}
