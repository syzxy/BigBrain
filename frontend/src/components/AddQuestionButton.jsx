import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import { Link as RouterLink } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  card: {
    flex: 1,
    width: '100%',
    height: theme.spacing(10),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    boxSizing: 'border-box',
  },
  add: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,220,0,0.05)',
    border: '3px dotted rgba(0,0,0,0.1)',
    '& svg': {
      color: 'rgba(0,0,0,0.3)',
      fontSize: theme.spacing(6),
    }
  },
}));

export function AddQuestionButton ({ gameID }) {
  const classes = useStyles();
  function generateQID () {
    return uuidv4();
  }
  return (
    <Paper elevation={0} className={`${classes.card} ${classes.add}`}>
      <Link
        component={RouterLink}
        to={`/editquestion/${gameID}/${generateQID().slice(0, 8)}`}
      >
        <IconButton aria-label="add">
          <AddIcon/>
        </IconButton>
      </Link>
      <Typography variant='h5' style={{ color: 'rgba(0,0,0,0.3)' }}>
        NEW QUESTION
      </Typography>
    </Paper>
  );
}

AddQuestionButton.propTypes = {
  gameID: PropTypes.string,
}
