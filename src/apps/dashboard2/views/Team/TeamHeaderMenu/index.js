import React from 'react'
import { HeaderMenu } from '../../../components/HeaderMenu'
import { IconTeams, IconTags } from '../../../components/Icon'
import { namespace } from '../../../../../utils/locales'
const tn = namespace('dashboard.teams')

export const TeamHeaderMenu = ({ usersSize, groupsSize }) => {
  return (
    <HeaderMenu
      items={[
        { to: '/team', onlyActiveOnIndex: true, title: tn('header-teams'), icon: <IconTeams />, titleCounter: usersSize },
        { to: '/team/tags', title: tn('header-tags'), icon: <IconTags />, titleCounter: groupsSize }
      ]}
    />
  )
}
