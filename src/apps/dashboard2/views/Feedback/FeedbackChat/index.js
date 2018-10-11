import React from 'react'
import Chat from '../../Chat'

const FeedbackChat = ({ params: { boxId, replyId } }) => {
  return (
    <Chat
      boxId={boxId}
      replyId={replyId}
      closePath={`/feedback/${boxId}/comments`}
    />
  )
}

export default FeedbackChat
