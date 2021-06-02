import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(3),
    boxShadow: '0 0 15px 2px rgba(0,0,0,0.1)',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  alert: {
    width: '100%',
    marginTop: theme.spacing(1),
  }
}));

export default function Form ({ view, title, showMsg, message, onChange, onCloseMsg, onSubmit }) {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      {/* reset  */}
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {title}
        </Typography>
        <form className={classes.form} action='none' noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => onChange({ email: e.target.value })}
          />
          {view === 'signup' &&
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="text"
            onChange={(e) => onChange({ name: e.target.value })}
          />}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete={view === 'login' ? 'current-password' : 'new-password'}
            onChange={(e) => onChange({ password: e.target.value })}
          />
          {view === 'signup' &&
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirm"
            label="Confirme Password"
            type="password"
            id="confirm"
            autoComplete="new-password"
            onChange={(e) => onChange({ confirm: e.target.value })}
          />}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={onSubmit}
            className={classes.submit}
          >
            {view === 'login' ? 'Log In' : 'Sign Up'}
          </Button>
          <Grid container>
            <Grid item>
              <Link component={RouterLink} to={view === 'login' ? '/signup' : '/login'} variant="body2">
                {view === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
              </Link>
            </Grid>
          </Grid>
        </form>
        <Collapse in={showMsg} className ={classes.alert}>
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={onCloseMsg}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {message}
          </Alert>
      </Collapse>
      </div>
    </Container>
  );
}

Form.propTypes = {
  view: PropTypes.string,
  title: PropTypes.string,
  showMsg: PropTypes.bool,
  message: PropTypes.string,
  onCloseMsg: PropTypes.func,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
}
