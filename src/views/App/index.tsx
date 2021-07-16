import React, { ReactElement, useMemo } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { SnackbarProvider } from 'notistack';
import RegisterPage from '../RegisterPage';
import HomePage from '../HomePage';
import { UserContextProvider } from '../../context/user';
import ErrorBoundary from '../../components/ErrorBoundary';
import RedirectIfLoggedIn from '../../components/guards/RedirectIfLoggedIn';
import LoginPage from '../LoginPage';
import NavBar from '../../components/NavBar';
import ErrorHandler from '../../components/ErrorHandler';
import { NoRouteMatchError } from '../../utils/errors';
import SettingsPage from '../SettingsPage';
import LeagueRankingsPage from '../LeagueRankingsPage';
import { HOME_PATH, LOGIN_PATH, LEAGUE_RANKINGS_PATH, VALORANT_RANKINGS_PATH, REGISTER_PATH, SETTINGS_PATH } from '../../utils/paths';
import ValorantRankingsPage from "../ValorantRankingsPage";

export default function App(): ReactElement {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        maxSnack={3}
        resumeHideDuration={0}
      >
        <ErrorBoundary>
          <BrowserRouter basename="">
            <Switch>
              <Route exact path={REGISTER_PATH}>
                <RedirectIfLoggedIn to={HOME_PATH}>
                  <RegisterPage />
                </RedirectIfLoggedIn>
              </Route>
              <Route exact path={LOGIN_PATH}>
                <RedirectIfLoggedIn to={HOME_PATH}>
                  <LoginPage />
                </RedirectIfLoggedIn>
              </Route>
              <UserContextProvider handleErrors>
                <NavBar>
                  <Route exact path={HOME_PATH}>
                    <HomePage />
                  </Route>
                  <Route exact path={SETTINGS_PATH}>
                    <SettingsPage />
                  </Route>
                  <Route exact path={LEAGUE_RANKINGS_PATH}>
                    <LeagueRankingsPage />
                  </Route>
                  <Route exact path={VALORANT_RANKINGS_PATH}>
                    <ValorantRankingsPage />
                  </Route>
                </NavBar>
              </UserContextProvider>
              <Route path="*">
                <ErrorHandler error={new NoRouteMatchError()} />
              </Route>
            </Switch>
          </BrowserRouter>
        </ErrorBoundary>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
