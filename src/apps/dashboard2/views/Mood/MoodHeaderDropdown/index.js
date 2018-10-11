import React, { PureComponent } from 'react'
import { Dropdown } from '../../../components/Dropdown'
import { IconExport, IconSettings, IconShare } from '../../../components/Icon'
import { namespace } from '../../../../../utils/locales'
const tn = namespace('dashboard.mood')

export class MoodHeaderDropdown extends PureComponent {
  render () {
    const { hasReplies, isShareEnabled, isAlreadyShared, isAdmin,
      openSettingsModal, onOpenShareModal, exportCurrentBox } = this.props
    return (
      <div className="bf-MoodHeaderDropdown">
        <Dropdown
          items={[{
            text: tn('menu-share'),
            icon: <IconShare isSmall />,
            onClick: onOpenShareModal,
            isDisabled: isAlreadyShared,
            isHidden: isShareEnabled
          }, {
            text: tn('menu-export'),
            icon: <IconExport />,
            onClick: exportCurrentBox,
            isDisabled: !hasReplies
          }, {
            text: tn('menu-settings'),
            icon: <IconSettings />,
            onClick: openSettingsModal,
            isHidden: !isAdmin
          }]}
        />
      </div>
    )
  }
}
