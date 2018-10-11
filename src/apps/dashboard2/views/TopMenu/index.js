import React, { PureComponent } from 'react'
import { Logo } from '../../components/Logo'
import t from '../../../../utils/locales'
import './index.css'

export class TopMenu extends PureComponent {
  render () {
    const { openLeftMenu, openGetFeedback } = this.props
    return (
      <div className="bf-TopMenu">
        <button className="bf-TopMenu-hamburger" onClick={openLeftMenu}>
          <span />
          <span />
          <span />
        </button>
        <button className="bf-TopMenu-ask" onClick={openGetFeedback}>
          {t('dashboard.menu.ask')}
          <Logo isSmall />
        </button>
      </div>
    )
  }
}
