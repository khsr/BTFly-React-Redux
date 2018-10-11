import React, { Component, PropTypes } from 'react'
import { values, range, min } from 'lodash'
import { MoodDriverIcon } from '../MoodDriverIcon'
import { InfoCallout } from '../InfoCallout'
import { namespace } from '../../../../utils/locales'
import './index.css'
const tn = namespace('question-mood')
const icons = [
  { title: tn('role'), driver: 'role' },
  { title: tn('management'), driver: 'management' },
  { title: tn('colleagues'), driver: 'colleagues' },
  { title: tn('environment'), driver: 'environment' },
  { title: tn('balance'), driver: 'balance' }
]

export class ChartDrivers extends Component {
  static propTypes = {
    drivers: PropTypes.object,
    previousDrivers: PropTypes.array,
    isSmall: PropTypes.bool,
    isEmpty: PropTypes.bool,
    noNumbers: PropTypes.bool
  }

  constructor () {
    super()
    this.state = { scoreDriver: null, score: null }
  }

  setScoreDriver = (scoreDriver, score) => {
    return () => this.setState({ scoreDriver, score })
  }

  removeScoreDriver = () => {
    this.setState({ scoreDriver: null, score: null })
  }

  render () {
    const { drivers, previousDrivers, isSmall, isEmpty, noNumbers, isWhite } = this.props
    const { scoreDriver, score } = this.state

    const scale = 1.4 // 16.4rem - 100% width, and driver is from 0...10
    const minHeight = 0.8
    const minDriver = drivers && !isWhite ? min(values(drivers)) : null
    const getDriver = (driver) => {
      return {
        isRed: drivers && drivers[driver] <= 5 && drivers[driver] === minDriver,
        score: drivers ? drivers[driver] : '-',
        height: drivers ? (drivers[driver] * scale || minHeight) : 0,
        prevHeights: previousDrivers.map((drivers) => {
          return {
            prevHeight: drivers ? (drivers[driver] * scale || minHeight) : 0,
            prevScore: drivers ? drivers[driver] : '-'
          }
        })
      }
    }

    return isEmpty ? (
      <div className="bf-ChartDrivers">
        <div className="bf-ChartDrivers-text">
          <p dangerouslySetInnerHTML={{ __html: tn('report-empty-text1') }} />
          <p>{tn('report-empty-text2', { available: tn('report-soon') })}</p>
        </div>
        <div className="bf-ChartDriversIcons">
          {icons.map(({ driver, title }, index) => {
            return (
              <div key={`${driver}-${index}`} className="bf-ChartDriversIcons-item">
                <div className="bf-ChartDriversIcons-item-bubble">
                  <MoodDriverIcon isWhite driverType={driver} />
                </div>
                <span>
                  {title}
                  <InfoCallout isGrey text={tn(`driver-${driver}`)} />
                </span>
              </div>
            )
          })}
        </div>
      </div>
    ) : (
      <div className="bf-ChartDrivers">
        <div className="bf-ChartDrivers-lines">
        {range(10, 0).map((n) => {
          return <div key={n}>{n % 2 === 0 && !noNumbers ? n : null}</div>
        })}
        </div>
        <div className="bf-ChartDriversIcons">
          {icons.map(({ driver, title }, index) => {
            const details = getDriver(driver)
            return (
              <div key={`${driver}-${index}`} className={`bf-ChartDriversIcons-item${details.isRed ? ' is-red' : ''}`}>
                <div className="bf-ChartDriversIcons-item-chart">
                  {details.prevHeights.map(({ prevHeight, prevScore }, index) => {
                    return (
                      <div
                        key={index}
                        className={`bf-ChartDriversIcons-item-chart-line is-left ${isWhite ? 'is-white' : 'is-grey'}`}
                      >
                        <div
                          style={{ height: `${prevHeight}rem` }}
                          onMouseEnter={this.setScoreDriver(driver, prevScore)}
                          onMouseLeave={this.removeScoreDriver}
                        />
                      </div>
                    )
                  })}
                  <div className={`bf-ChartDriversIcons-item-chart-line is-right is-${isWhite ? 'transparetnWhite' : (details.isRed ? 'red' : 'green')}`} >
                    <div
                      style={{ height: `${details.height}rem` }}
                      onMouseEnter={this.setScoreDriver(driver, details.score)}
                      onMouseLeave={this.removeScoreDriver}
                    />
                  </div>
                </div>
                <div
                  className={`bf-ChartDriversIcons-item-bubble${scoreDriver === driver ? ' is-active' : ''}`}
                  onClick={driver === scoreDriver ? this.removeScoreDriver : this.setScoreDriver(driver, details.score)}
                  onMouseEnter={this.setScoreDriver(driver, details.score)}
                  onMouseLeave={this.removeScoreDriver}
                >
                  {scoreDriver === driver
                    ? <span>{score}<div>/10</div></span>
                    : <MoodDriverIcon isWhite driverType={driver} />
                  }
                </div>
                <span className={isWhite ? 'is-white' : ''}>
                  {title}
                  {isSmall ? null : <InfoCallout isGrey={!isWhite} text={tn(`driver-${driver}`)} />}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}
