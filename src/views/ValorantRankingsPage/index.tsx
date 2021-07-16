import React, { ReactElement, useState } from 'react';
import {
  Button,
  CircularProgress,
  Container,
  Dialog,
  Grid,
  makeStyles,
  MenuItem,
  Select,
  Theme,
  Typography,
} from '@material-ui/core';
import gfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import { RequestMethods, useApiClient } from '../../utils/apiClient';
import { User, useUserContext } from '../../context/user';
import {camelizeKeys, coalesce} from '../../utils/general';
import { Ballot, GameOptions, Rankings } from '../../utils/types';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  contentWrapper: {
    marginTop: spacing(4),
  },
  title: {
    marginBottom: spacing(4),
  },
  dialog: {
    paddingLeft: spacing(2),
  },
  accountRow: {
    marginTop: spacing(2),
    marginBottom: spacing(2),
  },
  noAccountMessage: {
    marginTop: spacing(8),
  },
}));

export default function ValorantRankingsPage(): ReactElement {
  const { user: currentUser, updateBallot } = useUserContext();
  const [isFetching, users, usersError] = useApiClient<User[]>(RequestMethods.GET, 'users');
  const [isRankingsHelpOpen, setIsRankingsHelpOpen] = useState(false);
  const classes = useStyles();

  if (isFetching) return <CircularProgress />;

  if (usersError) throw usersError;

  const onRankingsHelpClick = () => setIsRankingsHelpOpen(true);

  const onDialogClose = () => setIsRankingsHelpOpen(false);

  const renderRankingOptions = () =>
    [Rankings.S, Rankings.A, Rankings.B, Rankings.C, Rankings.D].map((ranking) => (
      <MenuItem key={`${ranking}-${Rankings[ranking]}`} value={ranking}>
        {Rankings[ranking]}
      </MenuItem>
    ));

  const renderUserRow = ({ id, valorantAccounts }: User) => {
    const primaryAccount = valorantAccounts[0];
    const currentUserRankingBallots = coalesce(currentUser?.rankingBallots, []).filter(
      (ranking) => ranking.ranking_type === GameOptions.VALORANT
    );
    const currentUserRankingOfThisUser = currentUserRankingBallots.find((ballot: Ballot) => ballot.user_id === id);

    const rankingValue = currentUserRankingOfThisUser ? Rankings[currentUserRankingOfThisUser.ranking] : '';

    const boundOnChange = (event: React.ChangeEvent<{ value: unknown }>) =>
      updateBallot(id as number, event.target.value as number, GameOptions.VALORANT, primaryAccount);

    return (
      <Grid
        key={primaryAccount}
        container
        alignItems="flex-end"
        className={classes.accountRow}
        direction="row"
        justify="space-between"
      >
        {primaryAccount}
        <Select id={`${primaryAccount}-ranking-selector`} value={rankingValue} onChange={boundOnChange}>
          {renderRankingOptions()}
        </Select>
      </Grid>
    );
  };

  const usersWithLinkedAccounts = coalesce(users, []).map(user => camelizeKeys(user)).filter(
    (user) => user.id !== currentUser?.id && user.valorantAccounts && user.valorantAccounts.length > 0
  );

  const mainContent =
    usersWithLinkedAccounts.length === 0 ? (
      <Typography className={classes.noAccountMessage} component="h3" variant="h5">
        Looks like there is no one else to rate yet...
      </Typography>
    ) : (
      usersWithLinkedAccounts.map((user: User) => renderUserRow(user))
    );

  const rankingsHelpMarkdown = `
This is just a general guideline for how you may want to rank a player. Note that this is a guide, it's not definitive.

For example, a D ranked player may actually have superb mental and the game sense of an A rated player but simply lack
the mechanics. Choose a rating you feel is fair based off these guidelines.


### S Tier
This player has **god tier** aim. They can lead a team, call plays and knows how to improvise one if needed.
They are an **excellent** communicator. They know when to save and when to force buy.
They are a clutch master and losing them early in the round usually means a lost round.
They generally get at least 1-2 kills most rounds.
### A Tier
This player has **excellent** aim. They can lead a team if needed and call plays but cannot improvise
as well as an S tier player. They are an **good** communicator.
They generally know when to save and when to force buy. They can
clutch a round if needed and losing then early in the round usually means a lost round.
They generally get at least 1-2 kills most rounds.
### B Tier
This player has **good** aim. They can't really lead a team outside of call a play here and there.
They are an **good** communicator.
They generally know when to save and when to force buy. They can occasionally clutch a round if needed so long as the
enemy doesn't have their best players alive. Losing them early is a hit however the round won't be an auto loss.
They generally get at least 1 kill or do some decent damage most rounds.
### C Tier
This player has **average** aim. They can't really lead a team. They are an **average** communicator.
They generally do not know when to save and when to force buy.
They can rarely clutch a round if needed so long as the enemy doesn't have their best players alive.
Losing them early in a round doesn't mean much.
They generally get at least 1 kill or do some decent damage most rounds.
### D Tier
This player has **below average** aim. They can't really lead a team. They are an **decent** enough communicator.
They generally do not know when to save and when to force buy.
They can almost never clutch a round. Losing them early in a round doesn't mean much.
They generally get no kills a round but do some decent damage.
`;

  if (coalesce(currentUser?.valorantAccounts, []).length === 0) {
    return (
      <Typography component="h1" variant="h5">
        You do not have any linked accounts. Please link at least 1 Valorant account in order to be able to rank
        others.
      </Typography>
    );
  }

  return (
    <React.Fragment>
      <Container className={classes.contentWrapper} maxWidth="md">
        <Grid container direction="row">
          <Grid item>
            <Typography className={classes.title} component="h3" variant="h5">
              Rank Other Valorant Players
            </Typography>
          </Grid>
          <Grid item>
            <span>
              <Typography component="p">
                Rank other Valorant players on a scale of S-D (S being the best) on how well you think they place among
                everyone else.
              </Typography>
              <Typography component="p">
                Click{' '}
                <Button color="primary" onClick={onRankingsHelpClick}>
                  here
                </Button>{' '}
                for more information about what the rankings mean.
              </Typography>
            </span>
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth="sm">{mainContent}</Container>
      <Dialog
        fullWidth
        maxWidth="xs"
        open={isRankingsHelpOpen}
        PaperProps={{ className: classes.dialog }}
        onClose={onDialogClose}
      >
        <ReactMarkdown remarkPlugins={[gfm]}>{rankingsHelpMarkdown}</ReactMarkdown>
      </Dialog>
    </React.Fragment>
  );
}
