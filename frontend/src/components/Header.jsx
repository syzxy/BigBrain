import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { userContext } from '../utils/userContext';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Header ({ title = 'Welcome to BigBrain' }) {
  const classes = useStyles();
  const { token, updateUserSession } = useContext(userContext);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
        <Link to={token ? '/' : '/login' } style={{ textDecoration: 'none' }}>
          <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="brain homepage icon">
          🧠
          </IconButton>
          <Typography variant="srOnly">Homepage</Typography>
        </Link>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
          { token &&
            <IconButton
            size='medium'
            color='inherit'
            name='logout'
            aria-label='logout Button'
            onClick={() => updateUserSession('')}
            >
               <ExitToAppIcon />
            </IconButton> }
        </Toolbar>
      </AppBar>
    </div>
  );
}

Header.propTypes = {
  title: PropTypes.string,
}
