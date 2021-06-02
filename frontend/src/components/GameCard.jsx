import React, { useState, useEffect, useContext } from 'react';
import { userContext } from '../utils/userContext';
import API from '../utils/API';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import MenuBookTwoToneIcon from '@material-ui/icons/MenuBookTwoTone';
import TimerTwoToneIcon from '@material-ui/icons/TimerTwoTone';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import copy from 'copy-to-clipboard';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 340,
    '&:hover': {
      boxShadow: '0px 0px 20px 4px rgb(0 0 0 / 10%)',
      transform: 'scale(1.01)',
    },
  },
  header: {
    whiteSpace: 'nowrap',
    overflow: 'auto',
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
    backgroundSize: 'contain',
  },
  caption: {
    display: 'inline-flex',
    alignItems: 'center',
    '& > svg': {
      marginRight: '4px',
      color: '#ff5722',
    },
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function GameCard ({ position, name, thumbnail, id, onDelete }) {
  const classes = useStyles();
  const [questions, setQuestions] = useState([]);
  const [stage, setStage] = useState(-1);
  const [started, setStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const api = new API();
  const { token } = useContext(userContext);

  // Fetch question List of the game
  useEffect(() => {
    api.makeRequest(`admin/quiz/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(data => setQuestions(data.questions))
      .catch(err => console.warn(err));
  }, []);

  // Session control UI pop up
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
    startGame(id);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // Fetch sessionID when a new session opens
  const [sessionID, setSessionId] = useState();
  function fetchSessionId (id) {
    api.makeRequest(`admin/quiz/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(data => {
      setSessionId(data.active);
    });
  }

  // Open a new session of this game, players can join now
  const startGame = id => {
    api.makeRequest(`admin/quiz/${id}/start`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      fetchSessionId(id);
    }).catch((err) => {
      console.error(err.message);
    });
  }

  /**
   * Start hosting the session by advancing quiz position
   * This is also responsible for skipping to the next question
   */
  const advance = () => {
    api.makeRequest(`admin/quiz/${id}/advance`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(data => {
        setStage(data.stage);
        setStarted(true);
      })
      .catch(() => { // No more questions
        setStage(-1);
        setStarted(false);
      });
  }
  useEffect(() => {
    if (questions && stage === questions.length) {
      setShowResults(true);
    }
  }, [stage])

  // End an opened session for this game
  const handleEnd = () => {
    api.makeRequest(`admin/quiz/${id}/end`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      if (started) {
        setStage(-1);
        setShowResults(true);
        setStarted(false);
      } else {
        goHome();
      }
    });
  };

  // Helpers
  const goHome = () => {
    setShowResults(false);
    setOpen(false);
    setStarted(false);
  }
  const getGameTime = () => {
    return questions.reduce((a, c) => a + c.time, 0)
  }
  const handleCopy = () => {
    const url = `http://localhost:${window.location.port}/Join/${sessionID}`;
    copy(url)
  };

  return (
    <Grid item xs>
      <Card className={classes.root}>
        <CardHeader title={name} className={classes.header}/>
        <CardMedia
          className={classes.media}
          image={thumbnail}
          title={name}
          component="div"
        />
        <CardContent className={ classes.content }>
          <Typography
            className={classes.caption}
            variant="body2"
            color="textSecondary"
            component="span">
            <MenuBookTwoToneIcon fontSize='small'/>
            {`${questions.length} question(s)`}
          </Typography>
          <Typography
            className={classes.caption}
            variant="body2"
            color="textSecondary"
            component="span">
            <TimerTwoToneIcon fontSize='small'/>
            {`${getGameTime()}s`}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton
              aria-label="start game"
              name={`startgamebutton${position}`}
              onClick={handleClickOpen}>
              <PlayArrowIcon />
          </IconButton>
          <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
              <Toolbar>
                <Typography variant="h6" className={classes.title}>
                  {`The SessionId is ${sessionID}`}
                </Typography>
                <Button
                  autoFocus
                  color="inherit"
                  name="copy"
                  onClick={handleCopy}>
                    copy
                </Button>
              </Toolbar>
            </AppBar>
            <List>
              <ListItem button name="advance" onClick={advance}>
                <ListItemText primary={showResults || stage < 0 ? 'Start Session' : 'Next Question'}/>
              </ListItem>
              <Divider />
              <ListItem button name="endsession" onClick={handleEnd}>
                <ListItemText primary='End Session'/>
              </ListItem>
            </List>
          </Dialog>
          <Link to = {`/editgame/${id}`}>
            <IconButton aria-label="edit">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton
            aria-label="delete game"
            name='deletegame'
            onClick = {() => onDelete(id)}>
            <DeleteForeverIcon/>
          </IconButton>
        </CardActions>
      </Card>
      <Dialog open={showResults} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <SportsEsportsIcon />
            <Typography variant="h6" className={classes.title}>
              Game ended, would you like to view the results?
            </Typography>
          </Toolbar>
        </AppBar>
        <List>
          <ListItem button component={Link} to={`/results/${id}/${sessionID}`}>
            <ListItemText primary='YES'/>
          </ListItem>
          <Divider />
          <ListItem button onClick={goHome}>
            <ListItemText primary='NO'/>
          </ListItem>
        </List>
      </Dialog>
    </Grid>
  );
}

GameCard.propTypes = {
  name: PropTypes.string,
  thumbnail: PropTypes.string,
  numQuestions: PropTypes.number,
  totalTime: PropTypes.string,
  id: PropTypes.number,
  onDelete: PropTypes.func,
  position: PropTypes.number,
}
