import React from 'react'
import Chat from '../../Chat'

const MoodChat = ({ params: { boxId, replyId } }) => {
  return (
    <Chat
      boxId={boxId}
      replyId={replyId}
      closePath={`/mood/${boxId}/comments`}
      canBeResolved
    />
  )
}

export default MoodChat
