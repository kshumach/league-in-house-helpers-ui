import React, { ReactElement, useState } from 'react';
import {
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  makeStyles,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { useUserContext } from '../context/user';
import { coalesce } from '../utils/general';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  contentWrapper: {
    marginTop: spacing(2),
  },
  inputRow: {
    width: '100%',
  },
  divider: {
    marginTop: spacing(4),
    marginBottom: spacing(4),
  },
  newAccountInput: {
    width: '100%',
  },
  label: {
    marginBottom: spacing(2),
  },
  accountRow: {
    marginBottom: spacing(4),
  },
  submit: {
    margin: spacing(2, 0),
  },
  accountTag: {
    display: 'flex'
  }
}));

export default function LinkLeagueAccountForm(): ReactElement {
  const { user, removeValorantAccount, addValorantAccount } = useUserContext();
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountTag, setNewAccountTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const classes = useStyles();

  const onNewAccountNameChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setNewAccountName(event.target.value as string);
  };

  const onNewAccountTagChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setNewAccountTag((event.target.value as string).toUpperCase());
  };

  const onAddNewAccount = async () => {
    setIsLoading(true);

    await addValorantAccount(newAccountName, newAccountTag);

    setIsLoading(false);
  };

  const onDeleteAccount = async (accountName: string) => {
    setIsLoading(true);

    await removeValorantAccount(accountName);

    setIsLoading(false);
  };

  const renderAccountRow = (ign: string) => (
    <Grid key={ign} container alignItems="center" className={classes.accountRow} direction="row">
      <Grid item className={classes.inputRow} xs={8}>
        <Typography>{ign}</Typography>
      </Grid>
      <Grid item xs={4}>
        <Button color="secondary" startIcon={<DeleteIcon />} variant="contained" onClick={() => onDeleteAccount(ign)}>
          Unlink
        </Button>
      </Grid>
    </Grid>
  );

  const renderLinkedAccounts = () => {
    const accounts = coalesce(user?.valorantAccounts, []);
    if (accounts.length === 0) {
      return (
        <Typography className={classes.label} color="textSecondary" component="p">
          You do not have any linked accounts. Please use the input below to link one.
        </Typography>
      );
    }

    return accounts.map((name) => renderAccountRow(name));
  };

  const renderSubmitButton = () => {
    if (isLoading) {
      return (
        <Grid container justify="center">
          <CircularProgress className={classes.submit} />
        </Grid>
      );
    }

    return (
      <Button
        fullWidth
        className={classes.submit}
        color="primary"
        disabled={!newAccountName}
        type="submit"
        variant="contained"
        onClick={onAddNewAccount}
      >
        Submit
      </Button>
    );
  };

  return (
    <Container className={classes.contentWrapper} maxWidth="sm">
      <Typography className={classes.label} component="h3" variant="h5">
        Linked Valorant Accounts
      </Typography>
      {renderLinkedAccounts()}
      <Divider className={classes.divider} />
      <Typography className={classes.label} component="h3" variant="h5">
        Link New Valorant Account
      </Typography>
      <Grid container direction="row">
        <Grid item className={classes.inputRow} xs={6}>
          <TextField
            className={classes.newAccountInput}
            id="new-valorant-account-input"
            label="Account Name"
            value={newAccountName}
            variant="outlined"
            onChange={onNewAccountNameChange}
          />
        </Grid>
        <Grid item className={classes.inputRow} xs={4}>
          <div className={classes.accountTag}>
            <Typography className={classes.label} component="h3" variant="h3">
              #
            </Typography>
            <TextField
                className={classes.newAccountInput}
                id="new-valorant-account-tag-input"
                label="Account Tag"
                value={newAccountTag}
                variant="outlined"
                onChange={onNewAccountTagChange}
            />
          </div>
        </Grid>
      </Grid>
      <Grid item className={classes.inputRow} xs={12}>
        {renderSubmitButton()}
      </Grid>
    </Container>
  );
}
