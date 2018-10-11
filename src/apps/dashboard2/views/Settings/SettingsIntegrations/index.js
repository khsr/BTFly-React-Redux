import React from 'react'
import { connect } from '../../../utils/performance'
import { Icon } from '../../../components/Icon'
import iconSlack from './iconSlack.svg?react'
import { namespace } from '../../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.settings')

const mapStateToProps = ({ currentCompany }) => ({ currentCompany })

export const SettingsIntegrations = ({ currentCompany }) => {
  return (
    <div className="bf-SettingsIntegrations">
      <div className="bf-SettingsIntegrations-title">{tn('slack-title')}</div>
      <div className="bf-SettingsIntegrations-text">{tn('slack-text')}</div>
      {currentCompany.isSlackEnabled ? (
        <div className="bf-SettingsIntegrations-success">
          <Icon icon={iconSlack} />
          {tn('slack-success')}
        </div>
      ) : (
        <div>
          <a href="/slack/register">
            <img
              alt="Add to Slack"
              height="40"
              width="139"
              src="https://platform.slack-edge.com/img/add_to_slack.png" srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
            />
          </a>
          <a className="bf-SettingsIntegrations-what" href="https://support.butterfly.ai/slack.html">{tn('slack-what-is-this')}</a>
        </div>
      )}
    </div>
  )
}

export default connect(mapStateToProps)(SettingsIntegrations)
