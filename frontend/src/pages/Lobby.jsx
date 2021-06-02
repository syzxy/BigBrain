import React, { useContext, useEffect, useState } from 'react';
import WeekendIcon from '@material-ui/icons/Weekend';
import Typography from '@material-ui/core/Typography';
import { useParams, useHistory } from 'react-router-dom';
import { userContext } from '../utils/userContext';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import API from '../utils/API';

const useStyles = makeStyles((theme) => createStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: '100%',
    marginTop: theme.spacing(8),
  },
  icon: {
    width: '160px',
    height: '160px',
    color: theme.palette.text.secondary,
  },
}));

export default function Lobby () {
  const { playerID } = useParams();
  const { token } = useContext(userContext);
  const classes = useStyles();
  const [started, setStarted] = useState(false);
  const api = new API();
  const history = useHistory();

  // Poll server for game state
  useEffect(() => {
    const timer = !started && setInterval(() => {
      console.log(playerID, token.slice(0, 1));
      api.makeRequest(`play/${playerID}/status`)
        .then(data => setStarted(data.started))
        .catch(err => {
          console.error(err.message);
          setStarted(true);
        });
    }, 1000);

    // Redirect to playing screen
    if (started) {
      history.push(`/play/${playerID}`);
    }

    return () => {
      clearInterval(timer);
    }
  }, [started]);

  return (
    <div className={classes.root}>
      <Typography component='h2' variant='h2' align='center'>
        Waiting for the host to start
      </Typography>
      <Typography component='h2' color='textSecondary' variant='subtitle1' align='center'>
        Fasten your belt, the game is about to start!
      </Typography>
      <WeekendIcon className={classes.icon}/>
    </div>
  )
}
