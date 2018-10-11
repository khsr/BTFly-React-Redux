import React from 'react'
import { Route, Redirect, IndexRoute, useRouterHistory } from 'react-router'
import { createHistory } from 'history' // uses react-router/node_modules/history
import Layout from './views'
import Notifications from './views/Notifications'
import Profile from './views/Profile'
import Settings, { SettingsGeneral, SettingsIntegrations, SettingsAuth } from './views/Settings'
import { TeamUsers, TeamTags } from './views/Team'
import Feedback, { FeedbackChat, FeedbackCommentsWrapper, FeedbackReportWrapper } from './views/Feedback'
import Mood, { MoodReport, MoodCommentsWrapper, MoodChat } from './views/Mood'

export const router = useRouterHistory(createHistory)({ basename: '/dashboard' })

export function createRoutes ({ store }) {
  const indexOnEnter = (nextState, replace) => {
    const { boxes, currentUser } = store.getState()
    const hasMood = boxes.some((b) => b.type === 'mood')
    if (!boxes.size) {
      replace('/team')
    } else if (hasMood) {
      replace(`/mood${currentUser.isManager ? '/-/yourteam' : ''}`)
    } else {
      replace('/feedback')
    }
  }

  return (
    <Route path="/" component={Layout}>
      <IndexRoute onEnter={indexOnEnter} />
      <Route path="team">
        <IndexRoute component={TeamUsers} />
        <Route path="tags" component={TeamTags} />
      </Route>
      <Route path="settings" component={Settings}>
        <IndexRoute component={SettingsGeneral} />
        <Route path="integrations" component={SettingsIntegrations} />
        <Route path="auth" component={SettingsAuth} />
      </Route>
      <Route path="profile" component={Profile} />
      <Route path="notifications" component={Notifications} />
      <Route path="mood">
        <Route component={Mood}>
          <IndexRoute component={MoodReport} />
          <Route path=":boxId/comments" component={MoodCommentsWrapper} />
          <Route path=":boxId(/:groupId)" component={MoodReport} />
        </Route>
        <Route path=":boxId/chats/:replyId" component={MoodChat} />
      </Route>
      <Route path="feedback" component={Feedback}>
        <IndexRoute components={{content: FeedbackReportWrapper}} />
        <Route path="ask" components={{content: FeedbackReportWrapper}} />
        <Route path=":boxId/chats/:replyId" components={{chat: FeedbackChat}} />
        <Route path=":boxId/comments" components={{content: FeedbackCommentsWrapper}} />
        <Route path=":boxId" components={{content: FeedbackReportWrapper}} />
        <Route path=":boxId/:groupId" components={{content: FeedbackReportWrapper}} />
      </Route>
      <Redirect from="*" to="/" />
    </Route>
  )
}
