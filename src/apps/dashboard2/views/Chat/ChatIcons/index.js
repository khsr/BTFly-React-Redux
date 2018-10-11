import React from 'react'
import { InfoCallout } from '../../../components/InfoCallout'
import './index.css'

export const ChatIcons = ({ chats }) => {
  return (
    <div className="bf-ChatIcons">
      {chats.map((c) => {
        return (
          <div className="bf-ChatIcons-icon" key={c._id}>
            <InfoCallout text={c.managerName}>
              <img src={c.managerPicture} />
            </InfoCallout>
          </div>
        )
      })}
    </div>
  )
}
