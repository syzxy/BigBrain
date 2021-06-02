import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import TimerTwoToneIcon from '@material-ui/icons/TimerTwoTone';
import StarTwoToneIcon from '@material-ui/icons/StarTwoTone';

const useStyles = makeStyles((theme) => ({
  card: {
    width: '100%',
    height: theme.spacing(10),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: '1px solid rgba(0,0,0,0.1)',
    boxShadow: '0px 0px 5px 1px rgb(0 0 0 / 10%)',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    '&:hover': {
      boxShadow: '0px 0px 20px 4px rgb(0 0 0 / 10%)',
      transform: 'scale(1.01)',
    },
    boxSizing: 'border-box',
  },
  delete: {
    marginLeft: 'auto',
    '&:hover': {
      color: theme.palette.secondary.main,
    }
  },
  edit: {
    '&:hover': {
      color: theme.palette.success.main,
    }
  },
  caption: {
    display: 'inline-flex',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    '& svg': {
      color: '#ff5722',
    }
  }
}));

export default function QuestionCard ({ gameID, question, onDelete, displayID }) {
  const classes = useStyles();
  return (
    <Paper elevation={0} className={`${classes.card} ${classes.add}`}>
      <div>
        <Typography variant='h5' color='textSecondary'>
          QUESTION {displayID}
        </Typography>
        <Typography variant='caption' color='textSecondary' className={classes.caption}>
          <TimerTwoToneIcon fontSize='small'/>{question.time}
        </Typography>
        <Typography variant='caption' color='textSecondary'className={classes.caption}>
          <StarTwoToneIcon fontSize='small'/>{question.points}
        </Typography>
      </div>
      <IconButton
        aria-label="delete"
        className={classes.delete}
        onClick={() => onDelete(question.id)}
      >
        <DeleteIcon/>
      </IconButton>
      <Link component={RouterLink} to={`/editquestion/${gameID}/${question.id}`} aria-label="edit">
        <IconButton aria-label="add" className={classes.edit}>
          <EditIcon />
        </IconButton>
      </Link>
    </Paper>
  );
}

QuestionCard.propTypes = {
  gameID: PropTypes.string,
  question: PropTypes.object,
  onDelete: PropTypes.func,
  displayID: PropTypes.number,
}
