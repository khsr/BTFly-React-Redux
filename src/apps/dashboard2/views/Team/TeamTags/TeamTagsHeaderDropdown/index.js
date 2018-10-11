import React, { PureComponent } from 'react'
import { Dropdown } from '../../../../components/Dropdown'
import { IconDelete, IconExport } from '../../../../components/Icon'
import { namespace } from '../../../../../../utils/locales'
const tn = namespace('dashboard.teams')

export class TeamTagsHeaderDropdown extends PureComponent {
  render () {
    const { isAnySelected, onDelete, onUsersExport } = this.props
    return (
      <Dropdown
        items={[
          { text: tn('header-menu-delete-tags'), icon: <IconDelete />, onClick: onDelete, isDisabled: !isAnySelected },
          { text: tn('header-menu-export'), icon: <IconExport />, onClick: onUsersExport, isDisabled: !isAnySelected }
        ]}
      />
    )
  }
}
