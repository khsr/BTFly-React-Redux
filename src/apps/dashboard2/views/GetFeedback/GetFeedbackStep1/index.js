import React from 'react'
import { filesHost } from '../../../../../components/boot'
import { GetFeedbackPoll } from '../GetFeedbackPoll'
import { GetFeedbackAddQuestion } from '../GetFeedbackAddQuestion'
import { GetFeedbackClearForm } from '../GetFeedbackClearForm'

export const GetFeedbackStep1 = ({ polls, removePoll, onOptionSelect, onInputChange,
  onImageUpload, addPoll, clearForm, isSmall }) => {
  return (
    <div>
      {polls.map((poll, index) => {
        return (
          <GetFeedbackPoll
            key={index}
            text={poll.get('text')}
            imageSrc={poll.get('imageSrc')}
            imageUrl={poll.get('imageUrl') ? `${filesHost}/${poll.get('imageUrl')}` : ''}
            type={poll.get('type')}
            index={index}
            removePoll={removePoll}
            onOptionSelect={onOptionSelect}
            onInputChange={onInputChange}
            onImageUpload={onImageUpload}
            isSmall={isSmall}
          />
        )
      })}
      {polls.length < 5 ? <GetFeedbackAddQuestion addPoll={addPoll} /> : null}
      <GetFeedbackClearForm clearForm={clearForm} />
    </div>
  )
}
