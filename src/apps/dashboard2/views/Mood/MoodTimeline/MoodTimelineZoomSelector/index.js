import React, { PureComponent } from 'react'
import { namespace } from '../../../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.mood')

export class MoodTimelineZoomSelector extends PureComponent {
  handleChange = (e) => {
    e.preventDefault()
    this.props.onChange(e.target.value)
  }

  render () {
    const { value, options } = this.props
    return (
      <select
        className="bf-MoodTimelineZoomSelector"
        value={value}
        onChange={this.handleChange}
      >
        {options.map(option =>
          <option key={option} value={option}>
            {tn(`zoom-${option}`)}
          </option>
        )}
      </select>
    )
  }
}
