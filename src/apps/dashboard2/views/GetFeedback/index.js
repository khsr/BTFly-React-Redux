import React, { Component } from 'react'
import { router } from '../../routes'
import { fromPairs } from 'lodash'
import Immutable from 'immutable'
import moment from '../../utils/moment'
import { connect } from '../../utils/performance'
import { Modal, ModalAlert } from '../../components/Modal'
import { filterActive, exclude, filterGroupsByUser, filterUsersByGroup, filterInstantFeedbackGroups } from '../../redux/data-utils'
import { createBox } from '../../redux/actions/boxes'
import { uploadImageSrc } from '../../redux/actions'
import { GetFeedbackFooter } from './GetFeedbackFooter'
import { GetFeedbackProgressBar } from './GetFeedbackProgressBar'
import { GetFeedbackStep1 } from './GetFeedbackStep1'
import { GetFeedbackStep2 } from './GetFeedbackStep2'
import { GetFeedbackStep3 } from './GetFeedbackStep3'
import { GetFeedbackStep4 } from './GetFeedbackStep4'
import { namespace } from '../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.feedback')

const defaultPoll = new Immutable.Map({ text: '', imageSrc: '', type: 'smileys' })
const defaultPolls = new Immutable.List([defaultPoll])

const mapStateToProps = ({ groups, currentUser, users, isSmall }) => {
  const activeUsers = exclude(filterActive(users), currentUser)
  const filteredGroups = filterInstantFeedbackGroups(filterGroupsByUser(filterActive(groups), currentUser))
  const formattedGroups = filteredGroups.toArray().map((group) => {
    const amountOfReceivers = filterUsersByGroup(activeUsers, group).size
    return {
      _id: group._id,
      name: group.name,
      amountOfReceivers
    }
  }).filter((group) => group.amountOfReceivers >= 4)
  return {
    groups: formattedGroups,
    groupNames: fromPairs(formattedGroups.map((g) => [g._id, g.name])),
    totalUsers: activeUsers.size,
    notEnoughUsers: activeUsers.size < 4,
    isSmall
  }
}

class GetFeedback extends Component {
  componentWillMount = () => {
    this.clearForm()
  }

  redirectToTeams = () => {
    router.push('/team')
    return Promise.resolve()
  }

  incrementStep = () => {
    this.setState({ step: this.state.step + 1 })
  }

  decrementStep = () => {
    this.setState({ step: this.state.step - 1 })
  }

  toggleAnonymous = () => {
    this.setState({ isAnonymous: !this.state.isAnonymous })
  }

  onOptionSelect = ({ index, type }) => {
    const { polls } = this.state
    this.setState({ polls: polls.set(index, polls.get(index).set('type', type)) })
  }

  onInputChange = ({ index, text }) => {
    const { polls } = this.state
    const newPolls = polls.set(index, polls.get(index).set('text', text))
    const isStep1Disabled = newPolls.some((poll) => !poll.get('text'))
    this.setState({ polls: newPolls, isStep1Disabled })
  }

  onImageUpload = ({ index, imageSrc }) => {
    const { polls } = this.state
    this.setState({ polls: polls.set(index, polls.get(index).set('imageSrc', imageSrc)) })
  }

  addPoll = () => {
    this.setState({ polls: this.state.polls.push(defaultPoll), isStep1Disabled: true })
  }

  removePoll = (index) => {
    const newPolls = this.state.polls.delete(index)
    const isStep1Disabled = newPolls.some((poll) => !poll.get('text'))
    this.setState({ polls: newPolls, isStep1Disabled })
  }

  clearForm = () => {
    this.setState(this.getDefaultStateObject())
  }

  selectAllGroup = () => {
    const { groups } = this.props
    const { groupIds } = this.state
    const isAll = !this.state.isAll
    const newGroupsIds = isAll ? new Immutable.Set(groups.map((g) => g._id)) : groupIds
    this.setState({
      isAll,
      groupIds: newGroupsIds,
      isStep2Disabled: !isAll && newGroupsIds.size === 0
    })
  }

  createGroupSelect = (groupId) => {
    return () => {
      const { isAll, groupIds } = this.state
      const newGroupsIds = groupIds.has(groupId) ? groupIds.delete(groupId) : groupIds.add(groupId)
      this.setState({ groupIds: newGroupsIds, isStep2Disabled: !isAll && newGroupsIds.size === 0 })
    }
  }

  createScheduleToggle = (isScheduled) => {
    return () => {
      const { scheduleTime, scheduleDate } = this.state
      this.setState({ isScheduled, isStep3Disabled: isScheduled && !scheduleTime && !scheduleDate })
    }
  }

  onSetScheduleDate = (date) => {
    const { scheduleTime } = this.state
    this.setState({ scheduleDate: date, isStep3Disabled: !scheduleTime })
  }

  onSetScheduleTime = (e) => {
    const { scheduleDate } = this.state
    this.setState({ scheduleTime: e.target.value, isStep3Disabled: !scheduleDate })
  }

  sendRequest = () => {
    const { isAnonymous, isAll, groupIds, isScheduled, scheduleTime, scheduleDate } = this.state
    const { dispatch } = this.props
    const polls = this.state.polls.toArray().map((poll) => poll.toObject())
    this.setState({ step: 4 })
    return Promise.all(polls.map(({ imageSrc }, pollIndex) => {
      delete polls[pollIndex].imageSrc
      if (!imageSrc) return Promise.resolve()
      return uploadImageSrc(imageSrc).then((url) => {
        polls[pollIndex].imageUrl = url
      })
    })).then(() => {
      return dispatch(createBox({
        isAnonymous,
        isAll,
        groupIds: groupIds.toArray(),
        polls,
        timezone: moment.tz.guess(),
        schedule: !isScheduled ? null : {
          date: scheduleDate.format('DD.MM.YYYY'),
          time: moment(scheduleTime, 'h A - HH:mm').format('HH:mm')
        }
      }))
    })
  }

  getDefaultStateObject () {
    const { isAnonymous, isAll, polls, groupIds, step, isDuplicate, isStep1Disabled, isStep2Disabled } = this.props.opts
    return {
      isDuplicate: typeof isDuplicate !== 'undefined' ? isDuplicate : false,
      isStep1Disabled: typeof isStep1Disabled !== 'undefined' ? isStep1Disabled : true,
      isStep2Disabled: typeof isStep2Disabled !== 'undefined' ? isStep2Disabled : true,
      isStep3Disabled: false,
      isAnonymous: typeof isAnonymous !== 'undefined' ? isAnonymous : true,
      isAll: typeof isAll !== 'undefined' ? isAll : false,
      isScheduled: false,
      step: typeof step !== 'undefined' ? step : 1,
      groupIds: new Immutable.Set(typeof groupIds !== 'undefined' ? groupIds : []),
      scheduleDate: moment(),
      scheduleTime: moment().add(1, 'hour').startOf('hour').format('h A - HH:mm'),
      polls: typeof polls !== 'undefined' ? new Immutable.List(polls.map((p) => new Immutable.Map(p))) : defaultPolls
    }
  }

  render () {
    const { onClose, notEnoughUsers, groups, groupNames, totalUsers, isSmall } = this.props
    const { step, isStep1Disabled, isStep2Disabled, isStep3Disabled, isAnonymous, isDuplicate, isScheduled,
      groupIds, isAll, polls, scheduleDate, scheduleTime } = this.state
    const title = step === 1
    ? tn('step1-title')
    : (step === 2 ? tn('step2-title') : (isDuplicate ? tn('duplicate') : tn('step3-title')))
    const footer = (
      <GetFeedbackFooter
        step={step}
        isDisabled={step === 1 ? isStep1Disabled : (step === 2 ? isStep2Disabled : isStep3Disabled)}
        isAnonymous={isAnonymous}
        isDuplicate={isDuplicate}
        isScheduled={isScheduled}
        sendRequest={this.sendRequest}
        incrementStep={this.incrementStep}
        decrementStep={this.decrementStep}
        toggleAnonymous={this.toggleAnonymous}
      />
    )
    if (notEnoughUsers) {
      return (
        <ModalAlert
          title={tn('not-enough-users')}
          text={tn('needs-users')}
          submitTitle={tn('add-more-users')}
          onClose={onClose}
          onSubmit={this.redirectToTeams}
        />
      )
    }
    if (step === 4) {
      return <GetFeedbackStep4 onClose={onClose} />
    }
    return (
      <Modal isLarge title={`${step}. ${title}:`} footer={footer} onClose={onClose}>
        <GetFeedbackProgressBar step={step} />
        {step === 1 ? (
          <GetFeedbackStep1
            polls={polls.toArray()}
            removePoll={this.removePoll}
            onOptionSelect={this.onOptionSelect}
            onInputChange={this.onInputChange}
            onImageUpload={this.onImageUpload}
            addPoll={this.addPoll}
            clearForm={this.clearForm}
            isSmall={isSmall}
          />
        ) : (
          step === 2 ? (
            <GetFeedbackStep2
              groups={groups}
              isAnonymous={isAnonymous}
              totalUsers={totalUsers}
              groupIds={groupIds.toArray()}
              isAll={isAll}
              selectAllGroup={this.selectAllGroup}
              createGroupSelect={this.createGroupSelect}
            />
          ) : (
            <GetFeedbackStep3
              polls={polls.toArray()}
              isAll={isAll}
              isAnonymous={isAnonymous}
              isScheduled={isScheduled}
              groupNames={groupIds.map((gId) => groupNames[gId]).toArray()}
              createScheduleToggle={this.createScheduleToggle}
              scheduleDate={scheduleDate}
              scheduleTime={scheduleTime}
              onSetScheduleDate={this.onSetScheduleDate}
              onSetScheduleTime={this.onSetScheduleTime}
            />
          )
        )}
      </Modal>
    )
  }
}

export default connect(mapStateToProps)(GetFeedback)
