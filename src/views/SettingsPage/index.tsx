import React, { ReactElement, useState } from 'react';
import { Container, Paper, Tab, Tabs } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import { InspectableObject } from '../../utils/types';
import PasswordChangeForm from '../../components/PasswordChangeForm';
import LeagueRolePreferencesForm from '../../components/LeagueRolePreferencesForm';
import LinkLeagueAccountForm from '../../components/LinkLeagueAccountForm';
import LinkValorantAccountForm from '../../components/LinkValorantAccountForm';

enum TabOrdering {
  SETTINGS = 0,
  LEAGUE_ROLE_PREFERENCES = 1,
  VALORANT_ROLE_PREFERENCES = 2,
  LINK_LEAGUE_ACCOUNT = 3,
  LINK_VALORANT_ACCOUNT = 4,
}

const hashToSettingMap: { [key: string]: number } = {
  '#change-password': 0,
  '#league-role-preferences': 1,
  '#valorant-role-preferences': 2,
  '#link-league-account': 3,
  '#link-valorant-account': 4,
  '': 0,
};

interface TabPanelProps {
  children: ReactElement;
  currentValue: number;
  index: number;
}

function TabPanel({ children, currentValue, index }: TabPanelProps): ReactElement {
  return (
    <div aria-labelledby={`nav-tabpanel-${index}`} hidden={currentValue !== index} role="tabpanel">
      {children}
    </div>
  );
}

export default function SettingsPage(): ReactElement {
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState(hashToSettingMap[location.hash]);

  const onTabSelect = (_: React.ChangeEvent<NonNullable<InspectableObject>>, newTab: number) => setSelectedTab(newTab);

  return (
    <Container maxWidth="lg">
      <Paper>
        <Tabs centered aria-label="settings" role="tablist" value={selectedTab} onChange={onTabSelect}>
          <Tab
            aria-controls={`nav-tabpanel-${TabOrdering.SETTINGS}`}
            href="#change-password"
            id={`nav-tabpanel-${TabOrdering.SETTINGS}`}
            label="Change Password"
            role="tab"
          />
          <Tab
            aria-controls={`nav-tabpanel-${TabOrdering.LEAGUE_ROLE_PREFERENCES}`}
            href="#league-role-preferences"
            id={`nav-tabpanel-${TabOrdering.LEAGUE_ROLE_PREFERENCES}`}
            label="League Role Preferences"
            role="tab"
          />
          <Tab
            aria-controls={`nav-tabpanel-${TabOrdering.VALORANT_ROLE_PREFERENCES}`}
            href="#valorant-role-preferences"
            id={`nav-tabpanel-${TabOrdering.VALORANT_ROLE_PREFERENCES}`}
            label="Valorant Role Preferences"
            role="tab"
          />
          <Tab
            aria-controls={`nav-tabpanel-${TabOrdering.LINK_LEAGUE_ACCOUNT}`}
            href="#link-league-account"
            id={`nav-tabpanel-${TabOrdering.LINK_LEAGUE_ACCOUNT}`}
            label="Link League Account"
            role="tab"
          />
          <Tab
            aria-controls={`nav-tabpanel-${TabOrdering.LINK_VALORANT_ACCOUNT}`}
            href="#link-valorant-account"
            id={`nav-tabpanel-${TabOrdering.LINK_VALORANT_ACCOUNT}`}
            label="Link Valorant Account"
            role="tab"
          />
        </Tabs>
        <TabPanel currentValue={selectedTab} index={TabOrdering.SETTINGS}>
          <PasswordChangeForm />
        </TabPanel>
        <TabPanel currentValue={selectedTab} index={TabOrdering.LEAGUE_ROLE_PREFERENCES}>
          <LeagueRolePreferencesForm />
        </TabPanel>
        <TabPanel currentValue={selectedTab} index={TabOrdering.LINK_LEAGUE_ACCOUNT}>
          <LinkLeagueAccountForm />
        </TabPanel>
        <TabPanel currentValue={selectedTab} index={TabOrdering.LINK_VALORANT_ACCOUNT}>
          <LinkValorantAccountForm />
        </TabPanel>
      </Paper>
    </Container>
  );
}
