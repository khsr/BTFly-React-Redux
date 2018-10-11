import React from 'react'
import { Container, ContainerHeader, ContainerBodyWithPadding } from '../../components/Container'
import { HeaderMenu } from '../../components/HeaderMenu'
import { IconAuth, IconIntegrations, IconSettingsWheels } from '../../components/Icon'
import { namespace } from '../../../../utils/locales'

export { default as SettingsGeneral } from './SettingsGeneral'
export { default as SettingsIntegrations } from './SettingsIntegrations'
export { default as SettingsAuth } from './SettingsAuth'

const tn = namespace('dashboard.settings')

export default ({ children }) => {
  return (
    <Container>
      <ContainerHeader>
        <HeaderMenu
          items={[
            {
              to: '/settings',
              onlyActiveOnIndex: true,
              title: tn('title'),
              icon: <IconSettingsWheels isMedium />
            }, {
              to: '/settings/integrations',
              title: tn('title-integrations'),
              icon: <IconIntegrations isMedium />
            }, {
              to: '/settings/auth',
              title: tn('title-auth'),
              icon: <IconAuth isMedium />
            }
          ]}
        />
      </ContainerHeader>
      <ContainerBodyWithPadding>
        {children}
      </ContainerBodyWithPadding>
    </Container>
  )
}
