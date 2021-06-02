import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Typography,
  Button,
  TextField,
  makeStyles,
  IconButton,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import API from '../utils/API';

export default function PlayerNewSessionForm ({ setShowForm }) {
  const useStyles = makeStyles((theme) => ({
    bg: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      background: 'rgba(0,0,0,0.5)',
      zIndex: 1,
    },
    form: {
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
      background: 'white',
      padding: 20,
      borderRadius: 6,
      zIndex: 2,
      maxWidth: '90%',
      textAlign: 'center',
      justifyContent: 'space-between',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%,-50%)',
      '& > *': {
        marginTop: theme.spacing(2),
      }
    },
    title: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  }));
  const classes = useStyles();
  const [sessionID, setSessionID] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerID, setPlayerID] = useState();
  const [started, setStarted] = useState();
  const [focused, setFocused] = useState([false, false]);
  const defaultMsg = { text: '', show: false, successful: false }
  const [msg, setMsg] = useState(defaultMsg);
  const { gameID } = useParams();
  const api = new API();
  const history = useHistory();

  // Populate sessionID, if gameID is in url(i.e. url is copied from the host)
  useEffect(() => {
    if (gameID) {
      setSessionID(gameID);
    }
  }, [gameID]);

  // Redirect player to play page or lobby depending on whether or not the
  // game has started
  useEffect(() => {
    if (started) {
      setTimeout(() => {
        history.push(`/play/${playerID}`);
      }, 600);
    } else if (playerID && !started) {
      setTimeout(() => {
        history.push(`/lobby/${playerID}`);
      }, 600);
    }
  }, [started]);

  // Get session status once a playerId is returned from the server
  useEffect(() => {
    if (playerID) {
      api.makeRequest(`play/${playerID}/status`)
        .then(data => setStarted(data.started))
        .catch(err =>
          setMsg({ text: err.message, show: true, successful: true })
        );
    }
  }, [playerID]);

  // Basic validation: nither sessionID nor player name can be empty
  function validateForm () {
    if (sessionID.trim() === '') {
      setMsg({ text: 'SessionID cannot be empty', show: true, successful: false });
      setFocused([true, false]);
      return false;
    }
    if (playerName.trim() === '') {
      setMsg({ text: 'Player name cannot be empty', show: true, successful: false });
      setFocused([false, true]);
      return false;
    }
    setFocused([false, false]);
    return true;
  }

  function joinGame (sessionID) {
    api.makeRequest(`play/join/${sessionID}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ name: playerName }),
    })
      .then((data) => {
        setMsg({ text: 'Done! Joining in...', show: true, successful: true });
        // Simulate a delay
        setPlayerID(data.playerId);
        setTimeout(() => {
          setMsg(defaultMsg);
          setShowForm(false);
        }, 600);
      })
      .catch(() =>
        setMsg({
          text: 'No active session found',
          show: true,
          uccessful: false,
        })
      );
  }

  function handleJoin () {
    validateForm() && joinGame(sessionID);
  }

  return (
    <>
      <div className={classes.bg}></div>
      <form className={classes.form} noValidate autoComplete="off">
        <div className={classes.title}>
          <Typography component="span" variant="h5">
            Enter session ID and your name to join a game
          </Typography>
        </div>
        <TextField
          id="session-id"
          label="Session ID"
          variant="outlined"
          focused={focused[0]}
          value={sessionID}
          required
          autoFocus
          onChange={(e) => {
            setSessionID(e.target.value);
          }}
        />
        <TextField
          id="playern-ame"
          label="Name"
          variant="outlined"
          focused={focused[1]}
          value={playerName}
          required
          onChange={(e) => {
            setPlayerName(e.target.value);
          }}
        />
        <Button variant="contained" color="primary" onClick={handleJoin}>
          Submit
        </Button>
        {msg.show &&
          <Alert
            severity={msg.successful ? 'success' : 'error'}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setMsg({ defaultMsg })}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {msg.text}
          </Alert>
        }
      </form>
    </>
  )
}

PlayerNewSessionForm.propTypes = {
  setShowForm: PropTypes.func,
  msg: PropTypes.object,
  setMsg: PropTypes.func,
  onSubmit: PropTypes.func,
}
