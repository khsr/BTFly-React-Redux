import React, { Component } from 'react'
import { router } from '../../../routes'
import { TagsDropdown } from '../../../components/TagsDropdown'
import { IconFilter } from '../../../components/IconFilter'
import { MoodDriverIcon } from '../../../components/MoodDriverIcon'
import { MoodIndexIcon } from '../MoodIndexIcon'
import moment from '../../../utils/moment'
import countDelay from '../../../utils/count-delay'
import { getButterflyIndex, getMoodDrivers, filterRepliesByGroupIds,
         sortGroupsByDriverIndex } from '../../../redux/data-utils'
import { allDrivers, filterMoodDetails, getDriverFor } from '../mood-utils'
import { MoodTimelineItem } from './MoodTimelineItem'
import { MoodTimelineZoomSelector } from './MoodTimelineZoomSelector'
import { namespace } from '../../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.mood')

export class MoodTimeline extends Component {
  constructor () {
    super()
    this.state = { driver: 'mood' }
  }

  onSelectDriver = (driver) => {
    this.setState({ driver })
  }

  onCancelDriver = () => {
    this.setState({ driver: 'mood' })
  }

  onSelectGroup = (groupId) => {
    router.push(`/mood/${this.props.currentBox._id}${groupId ? `/${groupId}` : ''}`)
  }

  componentDidMount () {
    if (this.refs.chart) this.refs.chart.scrollIntoView(this.refs.$active)
  }

  componentDidUpdate ({ zoom }) {
    if (this.props.zoom !== zoom && this.refs.chart) this.refs.chart.scrollIntoView(this.refs.$active, true)
  }

  render () {
    const { currentCompany, currentBox, currentBoxes, currentGroup, zoom, zoomOptions,
            scrollLeft, setScrollLeft, onBoxChange, onNotesClick } = this.props
    const { driver } = this.state
    const groups = prepareGroupsForDriver(driver, this.props)
    const visibleGroup = (currentGroup ? groups.find((g) => g._id === currentGroup._id) : null) || groups[0]
    const hasCompanyLine = visibleGroup._id !== null
    return (
      <div className="bf-MoodTimeline">
        <div className="bf-MoodTimeline-header">
          <TagsDropdown
            IndexIcon={MoodIndexIcon}
            groups={groups}
            visibleGroup={visibleGroup}
            driver={driver}
            onClick={this.onSelectGroup}
          />
          <IconFilter
            isLeft
            isDark
            currentValues={driver === 'mood' ? [] : [driver]}
            values={allDrivers}
            icons={allDrivers.map((d) => <MoodDriverIcon isMedium driverType={d} />)}
            onSelect={this.onSelectDriver}
            onCancel={this.onCancelDriver}
          />
        </div>
        {currentBoxes.length === 0 ? (
          <div className="bf-MoodTimeline-body">
            <div className="bf-MoodTimeline-body-empty">
              {tn('report-check-in', { checkIn: moment.duration(countDelay(currentCompany.moodSettings)).humanize() })}
            </div>
          </div>
        ) : (
          <div className="bf-MoodTimeline-body">
            <MoodTimelineBase
              ref="chart"
              className="bf-MoodTimeline-body-chart"
              scrollLeft={scrollLeft}
              setScrollLeft={setScrollLeft}
            >
              {currentBoxes.map(box => {
                const isActive = box === currentBox
                const href = isActive ? null : `/dashboard/mood/${box._id}${currentGroup ? `/${currentGroup._id}` : ''}`
                const ref = isActive ? '$active' : null
                const isLive = box.status[0] !== 'disabled' && box.status.length === 1
                const driverIndex = getDriverFor(driver, box)
                const companyDriverIndex = getDriverFor(driver, {
                  bfIndex: getButterflyIndex(box.allReplies),
                  drivers: getMoodDrivers(filterMoodDetails(box.allReplies))
                })
                return (
                  <MoodTimelineItem
                    key={box._id}
                    ref={ref}
                    boxId={box._id}
                    href={href}
                    zoom={zoom}
                    driver={driver}
                    driverIndex={driverIndex}
                    companyDriverIndex={companyDriverIndex}
                    isLive={isLive}
                    isActive={isActive}
                    createdAt={box.createdAt}
                    notesLength={box.notes.length}
                    unreadNotesLength={box.unreadNotes.length}
                    hasCompanyLine={hasCompanyLine}
                    onBoxSelect={onBoxChange}
                    onNotesClick={onNotesClick}
                  />
                )
              })}
            </MoodTimelineBase>
          </div>
        )}
        <div className="bf-MoodTimeline-footer">
          <div className="bf-MoodTimeline-footer-item is-bar">
            {visibleGroup.name}<span />
          </div>
          {hasCompanyLine ? (
            <div className="bf-MoodTimeline-footer-item is-line">
              {currentCompany.fullName}<span />
            </div>
          ) : null}
          <MoodTimelineZoomSelector options={zoomOptions} value={zoom} onChange={this.props.onZoomChange} />
        </div>
      </div>
    )
  }
}

export class MoodTimelineBase extends Component {
  scrollIntoView ($active, forceScrollIntoView = false) {
    const { scrollLeft } = this.props
    if ($active && (!scrollLeft || forceScrollIntoView)) {
      setTimeout(() => $active.scrollIntoView(false)) // sometimes view is not ready yet
    } else {
      this.refs.$chart.scrollLeft = scrollLeft
    }
  }

  componentWillReceiveProps ({ scrollLeft }) {
    const { scrollLeft: prevScrollLeft } = this.props
    if (scrollLeft !== prevScrollLeft) {
      this.refs.$chart.scrollLeft = scrollLeft
    }
  }

  componentWillUnmount () {
    this.props.setScrollLeft(this.refs.$chart.scrollLeft)
  }

  render () {
    const { className, children } = this.props
    return <div className={className} ref="$chart">{children}</div>
  }
}

function prepareGroupsForDriver (driver, props) {
  const { currentGroups, currentGroup, currentCompany, currentBox, currentUser, yourTeam } = props
  const formatGroup = (group, groupIds) => {
    const { allQuestions, allReplies } = currentBox
    const groupReplies = filterRepliesByGroupIds(allQuestions, allReplies, groupIds)
    const bfIndex = getButterflyIndex(groupReplies)
    const drivers = getMoodDrivers(filterMoodDetails(groupReplies))
    return {
      _id: group._id,
      name: group.name,
      driverIndex: getDriverFor(driver, { bfIndex, drivers })
    }
  }
  const groups = currentGroups
  .map((g) => formatGroup(g, [g._id]))
  .sort(sortGroupsByDriverIndex)
  .toArray()
  if (currentGroup && currentGroup._id !== yourTeam._id && !groups.some((g) => g._id === currentGroup._id)) {
    groups.unshift({
      _id: currentGroup._id,
      name: currentGroup.name,
      driverIndex: null,
      isDisabled: true
    })
  }
  groups.unshift({ _id: 'separator' })
  if (currentUser.isManager) {
    groups.unshift(formatGroup(yourTeam, groups.map((g) => g._id)))
  } else {
    const bfIndex = getButterflyIndex(currentBox.allReplies)
    const drivers = getMoodDrivers(filterMoodDetails(currentBox.allReplies))
    groups.unshift({
      _id: null,
      name: currentCompany.fullName,
      driverIndex: getDriverFor(driver, { bfIndex, drivers })
    })
  }
  return groups
}
