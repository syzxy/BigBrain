import React, { useState } from 'react';
import Header from '../components/Header';
import { makeStyles } from '@material-ui/core/styles';
import PlayerNewSessionForm from '../components/PlayerNewSessionForm';
// import API from '../utils/API';
// import PropTypes from 'prop-types';

export default function Join () {
  // const [sessionpage, setSessionPage] = useState(false);
  const [showForm, setShowForm] = useState(true);
  // const [msg,setMsg] = useState({ content: '', show: false });
  const useStyles = makeStyles(() => ({
    root: {
      flexGrow: 1,
      margin: 5,
      padding: 5,
    },
  }));
  const classes = useStyles();

  // fetch valid session ID (url)

  return (
    <>
      <Header title='Join a game'/>
      <div className={classes.root}>
        <h1>Player Join Game Here</h1>
        {showForm && <PlayerNewSessionForm
        setShowForm={setShowForm}/>
        }
      </div>
    </>
  );
}
