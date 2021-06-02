import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    margin: '0 auto',
  }
}));

export default function Footer () {
  return (
      <div>
          <Copyright/>
      </div>
  );
}

function Copyright () {
  const classes = useStyles();
  return (
    <div >
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Typography variant="body2" color="inherit" align="center">
            {'Copyright © '}
            Yunqi Wang & Yunze Shi{' '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
