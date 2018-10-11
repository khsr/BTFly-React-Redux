import React, { PureComponent } from 'react'
import { Dropdown } from '../../../../components/Dropdown'
import { IconImport, IconAdd, IconExport, IconTagUsers, IconDelete, IconBoxChecked } from '../../../../components/Icon'
import { namespace } from '../../../../../../utils/locales'
const tn = namespace('dashboard.teams')

export class TeamHeaderDropdown extends PureComponent {
  render () {
    const { isAdmin, selectedUsers, onTagUsers, onDownloadUsers, onImportUsers, onDeleteUsers, onCreateUsers, onSelectAllUsers } = this.props
    const noSelection = !selectedUsers.length
    return (
      <Dropdown
        items={[
          { text: tn('header-menu-import'), icon: <IconImport />, onClick: onImportUsers, isHidden: !isAdmin },
          { text: tn('header-menu-add'), icon: <IconAdd />, onClick: onCreateUsers, isHidden: !isAdmin },
          { text: tn('header-menu-select-all'), icon: <IconBoxChecked />, onClick: onSelectAllUsers },
          { text: tn('header-menu-export-all'), icon: <IconExport />, onClick: onDownloadUsers },
          { type: 'separator' },
          { text: tn('header-menu-export'), icon: <IconExport />, onClick: onDownloadUsers, isDisabled: noSelection },
          { text: tn('header-menu-tags'), icon: <IconTagUsers />, onClick: onTagUsers, isDisabled: noSelection },
          { text: tn('header-menu-delete'), icon: <IconDelete />, onClick: onDeleteUsers, isDisabled: noSelection, isHidden: !isAdmin }
        ]}
      />
    )
  }
}
