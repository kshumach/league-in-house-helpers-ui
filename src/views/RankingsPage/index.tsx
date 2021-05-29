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
import { coalesce } from '../../utils/general';
import { Ballot, Rankings } from '../../utils/types';

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
  summonerRow: {
    marginTop: spacing(2),
    marginBottom: spacing(2),
  },
  noSummonersMessage: {
    marginTop: spacing(8)
  }
}));

export default function RankingsPage(): ReactElement {
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

  const renderUserRow = ({ id, summoners }: User) => {
    const primarySummoner = summoners[0];
    const currentUserRankingBallots = coalesce(currentUser?.rankingBallots, []);
    const currentUserRankingOfThisUser = currentUserRankingBallots.find((ballot: Ballot) => ballot.user_id === id);

    const rankingValue = currentUserRankingOfThisUser ? Rankings[currentUserRankingOfThisUser.ranking] : '';

    const boundOnChange = (event: React.ChangeEvent<{ value: unknown }>) =>
      updateBallot(id as number, event.target.value as number, primarySummoner);

    return (
      <Grid
        key={primarySummoner}
        container
        alignItems="flex-end"
        className={classes.summonerRow}
        direction="row"
        justify="space-between"
      >
        {primarySummoner}
        <Select id={`${primarySummoner}-ranking-selector`} value={rankingValue} onChange={boundOnChange}>
          {renderRankingOptions()}
        </Select>
      </Grid>
    );
  };

  const usersWithLinkedSummoners = coalesce(users, [])
      .filter((user) => (user.id !== currentUser?.id) && (user.summoners && user.summoners.length > 0));

  const mainContent = (
      usersWithLinkedSummoners.length === 0
          ? (
              <Typography className={classes.noSummonersMessage} component="h3" variant="h5">
                Looks like there is no one else to rate yet...
              </Typography>
          )
          : usersWithLinkedSummoners.map((user: User) => renderUserRow(user))
  );

  const rankingsHelpMarkdown = `
This is just a general guideline for how you may want to rank a player. Note that this is a guide, it's not definitive.

For example, a D ranked player may actually have superb mental and the game sense of an A rated player but simply lack
the mechanics. Choose a rating you feel is fair based off these guidelines.


### S Tier
This player is a **shot caller**. They have **excellent communication** and regularly lead the team.
Their **mechanics and game sense are top tier** and **regularly serve as the linchpin** of a team.
They have a **strong mental** and **do not** tilt or give up easily.
### A Tier
They have **excellent communication** and can lead the team occasionally. Their **mechanics and game
sense are top tier** and **regularly serve as the linchpin** of a team. They have a **good mental** and 
**may occasionally** tilt or give up as easily as a lower rated player.
### B Tier
They have **good communication** but not enough to lead a team. Their **mechanics and game
sense are above average** and **occasionally serve as the linchpin** of a team. They have a **average mental** and 
**may occasionally** tilt or give up as easily as a lower rated player.
### C Tier
They have **average communication** but not enough to lead a team. Their **mechanics and game
sense are average** and **rarely serve as the linchpin** of a team. They have a **average mental** and 
**may occasionally** tilt or give up as easily as a D rated player.
### D Tier
They have **below average communication** and lack the game sense to lead a team. Their **mechanics and game
sense are below average** and may be a **liability** to their team. They tend to tilt or give up **easily**.
`;

  return (
    <React.Fragment>
      <Container className={classes.contentWrapper} maxWidth="md">
        <Grid container direction="row">
          <Grid item>
            <Typography className={classes.title} component="h3" variant="h5">
              Rank Other Players
            </Typography>
          </Grid>
          <Grid item>
            <span>
              <Typography component="p">
                Rank other players on a scale of S-D (S being the best) on how well you think they place among everyone
                else.
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
      <Container maxWidth="sm">
        {mainContent}
      </Container>
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
