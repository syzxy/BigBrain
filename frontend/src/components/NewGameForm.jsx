import React, { useState } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import {
  Typography,
  IconButton,
  Button,
  TextField,
  makeStyles,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';

export default function NewGameForm ({ setShowForm, msg, setMsg, onSubmit }) {
  const useStyles = makeStyles(() => ({
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
      padding: 10,
      borderRadius: 6,
      zIndex: 2,
      width: '400px',
      maxWidth: '90%',
      height: '240px',
      textAlign: 'center',
      justifyContent: 'space-between',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%,-50%)',
    },
    title: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'center',
      '& > *': {
        margin: '0 8px',
      },
    },
    hidden: {
      display: 'none',
    },
  }));
  const [focused, setFocused] = useState(false);
  const [game, setGame] = useState({ name: '', thumbnail: '', questions: [] });
  const classes = useStyles();

  function handleGameUpload (e) {
    const fr = new FileReader();
    fr.onload = e => {
      setGame(JSON.parse(e.target.result));
    }
    fr.readAsText(e.target.files[0]);
  }

  function reset () {
    setGame({ name: '', thumbnail: '', questions: [] });
  }

  return (
    <>
      <div className={classes.bg}></div>
      <form className={classes.form} noValidate autoComplete="off">
        <div className={classes.title}>
          <Typography component="p" variant="h5">
            Create a new game
          </Typography>
          <IconButton
            color="primary"
            component="span"
            name="closeform"
            onClick={() => {
              setShowForm(false);
              setMsg({});
            }}>
            <CloseIcon />
          </IconButton>
        </div>
        <Typography component="p" variant="subtitle2">
          Create an empty new game by typing in a name and submit.<br/>
          Or upload a json file containing a whole game.
        </Typography>
        <TextField
          id="outlined-basic"
          label="Game title"
          name="gamename"
          variant="outlined"
          focused={focused}
          value={game.name}
          required
          autoFocus
          onChange={(e) => {
            setGame({ ...game, name: e.target.value });
            setMsg({});
          }}
        />
        <div className={classes.buttonGroup}>
          <Button
            variant="contained"
            color="primary"
            name="submit"
            onClick={(e) => {
              if (game.name.trim() === '') {
                setMsg({
                  content: 'Title cannot be empty or spaces only',
                  show: true,
                  success: false,
                });
              } else {
                setGame({ ...game, name: '' });
                onSubmit(game);
              }
              setFocused(true);
            }}>
              Submit
          </Button>
          <input
            className={classes.hidden}
            accept="application/json"
            id="contained-button-file"
            multiple
            type="file"
            onChange={(e) => handleGameUpload(e)}
          />
          <label htmlFor="contained-button-file">
            <Button
              variant="contained"
              color="primary"
              component="span"
              name="upload">
                Upload
            </Button>
          </label>
          <Button
            variant="contained"
            color="secondary"
            name="reset"
            onClick={reset}>
            Reset
          </Button>
        </div>
        { msg.show &&
          <Alert severity={msg.success ? 'success' : 'error'}>
            {msg.content}
          </Alert>}
      </form>
    </>
  )
}

NewGameForm.propTypes = {
  setShowForm: PropTypes.func,
  msg: PropTypes.object,
  setMsg: PropTypes.func,
  onSubmit: PropTypes.func,
}
