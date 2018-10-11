import React, { PureComponent } from 'react'
import { FormCheck } from '../../../components/FormCheck'
import { namespace } from '../../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.feedback')

export class GetFeedbackStep2 extends PureComponent {
  render () {
    const { groups, isAll, groupIds, totalUsers, selectAllGroup, createGroupSelect } = this.props
    return (
      <div>
        <GetFeedbackGroup
          isFullWidth
          isSelected={isAll}
          isPartial={isAll && groupIds.length < groups.length}
          title={tn('everyone')}
          counter={totalUsers}
          comment={tn('everyone-comment')}
          onClick={selectAllGroup}
        />
        {groups.length ? (
          <div>
            <div className="bf-GetFeedbackGroupsSeparator" />
            {groups.map(({ _id, name, amountOfReceivers }) => {
              return (
                <GetFeedbackGroup
                  key={_id}
                  title={name}
                  counter={amountOfReceivers}
                  isSelected={groupIds.includes(_id)}
                  onClick={createGroupSelect(_id)}
                />
              )
            })}
          </div>
        ) : null}
      </div>
    )
  }
}

class GetFeedbackGroup extends PureComponent {
  render () {
    const { title, counter, comment, isSelected, isFullWidth, isPartial, onClick } = this.props
    const className = `bf-GetFeedbackGroup${isSelected ? ' is-selected' : ''}${isFullWidth ? ' is-fullWidth ' : ''}`
    return (
      <button type="button" className={className} onClick={onClick}>
        <FormCheck isChecked={isSelected && !isPartial} isPartial={isPartial} />
        {`${title} - ${counter}`}
        {comment ? <span>{`(${comment})`}</span> : null}
      </button>
    )
  }
}
