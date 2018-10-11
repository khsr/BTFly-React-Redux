import React, { PureComponent } from 'react'
import classNames from 'classnames'
import { parseBody } from '../../../../../utils/replies-utils'
import { formatDateTime } from '../../../utils/moment'
import { namespace } from '../../../../../utils/locales'
import { IconTags } from '../../../components/Icon'

import './index.css'
const tn = namespace('dashboard.mood-notes')

export class MoodNote extends PureComponent {
  handleTagsChangeClick = (e) => {
    e.preventDefault()
    const { onTagsChange, note: { _id } } = this.props
    onTagsChange(_id)
  }

  render () {
    const { note: { body, manager, tags, inQueue, createdAt, isPrivate }, isMine } = this.props
    const className = classNames('bf-MoodNote', {
      'is-mine': isMine,
      'is-private': isMine && isPrivate
    })
    const tagsText = [
      tags.slice(0, -1).join(', '),
      tags.slice(-1)
    ].filter(value => value).join(' & ')
    return (
      <div className={className}>
        <div className="bf-MoodNote-left">
          <div className="bf-MoodNote-pictureWrapper">
            <div className="bf-MoodNote-picture" style={{ backgroundImage: `url(${manager.picture})` }} />
          </div>
        </div>
        <div className="bf-MoodNote-right">
          <div className="bf-MoodNote-header">
            <span className="bf-MoodNote-header-name">
              {isMine ? tn('you-prefix') : manager.fullName}
              {isPrivate ? ` (${tn('private-suffix').toUpperCase()})` : null}
              {!isMine ? ` (${tn('role-' + manager.role)})` : null}
            </span>
            <span className="bf-MoodNote-header-date">
              {' - '}
              {formatDateTime(createdAt)}
            </span>
          </div>
          <div
            className="bf-MoodNote-body"
            dangerouslySetInnerHTML={{ __html: parseBody(body) }}
          />
          {isMine && !inQueue ? (
            <div className="bf-MoodNote-tags is-editable" onClick={this.handleTagsChangeClick}>
              <IconTags />
              <span>{tagsText || tn('add-tags')}</span>
            </div>
          ) : <div className="bf-MoodNote-tags"><span>{tagsText || String.fromCharCode('&nbsp;')}</span></div>}
        </div>
      </div>
    )
  }
}
