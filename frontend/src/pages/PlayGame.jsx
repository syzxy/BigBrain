import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import API from '../utils/API';
import MediaCard from '../components/MediaCard';
import {
  Paper,
  Typography,
  Radio,
  Checkbox,
  Divider,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import TimerTwoTone from '@material-ui/icons/TimerTwoTone';
import EmojiEmotionsTwoToneIcon from '@material-ui/icons/EmojiEmotionsTwoTone';
import SentimentVeryDissatisfiedTwoToneIcon from '@material-ui/icons/SentimentVeryDissatisfiedTwoTone';
import Alert from '@material-ui/lab/Alert';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    '& > *': {
      margin: theme.spacing(2),
    }
  },
  paper: {
    padding: theme.spacing(3),
  },
  mediaCard: {
    margin: '0 auto',
    maxWidth: '340px',
    width: '100%',
  },
  image: {
    maxWidth: '100%',
    objectFit: 'contain',
  },
  horizontal: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vertical: {
    flexDirection: 'column',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 100,
  },
  option: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: theme.spacing(1),
    width: '80%',
    maxWidth: '600px',
  },
  divider: {
    height: 28,
    margin: 4,
  },
  alert: {
    marginTop: theme.spacing(1),
  },
  icon: {
    color: '#ff5722',
  },
  correct: {
    minWidth: '600px',
    background: 'rgba(0,255,0,0.1)',
  },
  wrong: {
    minWidth: '600px',
    background: 'rgba(255,0,0,0.1)',
  },
}));

function Timer ({ timeRemain, classes }) {
  return (
    <div className={classes.horizontal}>
      <TimerTwoTone className={classes.icon} />
      <Typography component="span" variant='subtitle1'>
        Time remaining:
      </Typography>
      <Typography component="span" variant='subtitle1'>
        {timeRemain}
      </Typography>
    </div>
  )
}

function Options ({ question, classes, answerIds, setMsg, setSelections, disabled }) {
  const [selectedRadio, setSelectedRadio] = useState();
  const blankCheckedBox = Array(question.options.length).fill(false);
  const [checkedBox, setCheckedBox] = useState(blankCheckedBox);
  const [selected, setSelected] = useState(false); // mark if a user ever made a selection
  const [text, setText] = useState();

  useEffect(() => {
    console.log(question);
    question.type === 'single'
      ? setText('Question type: single choice. Select your answer below')
      : setText('Question type: multiple choices. Select your answers below');
  }, [question]);

  // Reset UI states on new question
  useEffect(() => {
    setSelected(false);
    setSelectedRadio();
    setCheckedBox(blankCheckedBox);
  }, [question]);

  // answerIds returned only when time expired
  useEffect(() => {
    if (answerIds) {
      checkSelectionsAgainst(answerIds);
    }
  }, [answerIds]);

  useEffect(() => {
    if (selected) {
      setSelections(checkedBox.map((e, i) => e ? i : -1).filter(e => e >= 0));
    }
  }, [checkedBox, selected]);

  useEffect(() => {
    if (selectedRadio !== undefined) {
      setSelections([selectedRadio]);
    }
  }, [selectedRadio]);

  function checkSelectionsAgainst (correctAnswers) {
    let isCorrect;
    if (question.type === 'single') {
      isCorrect = selectedRadio === correctAnswers[0];
      setMsg({
        content: isCorrect
          ? 'Great! You got the right answer.'
          : `Sorry, the correct answer is option ${correctAnswers[0] + 1}`,
        show: true,
        successful: isCorrect,
      });
    } else {
      const numSelections = checkedBox.reduce((a, c) => c ? a + 1 : a, 0);
      isCorrect = (numSelections === correctAnswers.length &&
        correctAnswers.every(a => checkedBox[a]));
      setMsg({
        content: isCorrect
          ? 'Great! You got the right answer.'
          : `Sorry, the correct answers are options ${correctAnswers.map(a => a + 1).join(' ')}`,
        show: true,
        successful: isCorrect,
      });
    }
  }

  function handleSingleAnswer (index) {
    setSelectedRadio(index);
  }

  function handleMultiAnswer (index) {
    setCheckedBox(checkedBox.map((checked, i) =>
      i === index ? !checked : checked
    ));
    setSelected(true);
  }

  return <>
      <Typography component='h2' variant='subtitle2'>
        {text}
      </Typography>
      {question.options.map((option, i) => (
        <Paper key={i} className={classes.option}>
          {question.type === 'single'
            ? <Radio
                value={i}
                checked={selectedRadio === i}
                onChange={() => handleSingleAnswer(i)}
                inputProps={{ 'aria-label': 'radio button' }}
                disabled={disabled}
              />
            : <Checkbox
                value={i}
                checked={checkedBox[i]}
                onChange={() => handleMultiAnswer(i)}
                inputProps={{ 'aria-label': 'primary checkbox' }}
                disabled={disabled}
              />
            }
          <Divider className={classes.divider} orientation="vertical" />
          <span>{option.content}</span>
        </Paper>))
      }
    </>
}

function Result ({ result, forWhich, classes }) {
  return (
  <Paper
    elevation={1}
    className={clsx(
      classes.paper,
      classes.horizontal,
      result.correct ? classes.correct : classes.wrong
    )}
  >
    {result.correct
      ? <EmojiEmotionsTwoToneIcon/>
      : <SentimentVeryDissatisfiedTwoToneIcon/>}
    <Typography component='h2' variant='h6'>
      Question {forWhich + 1} {result.correct ? 'correct' : 'wrong'}
    </Typography>
    <TimerTwoTone style={{ marginLeft: 'auto' }}/>
    <Typography component='span' variant='caption'>
      time took: {result.answeredAt && result.questionStartedAt
      ? `${Math.floor((new Date(result.answeredAt) - new Date(result.questionStartedAt)) / 1e3)}s`
      : 'Not attempted'}
    </Typography>
  </Paper>
  )
}

function Results ({ results, classes }) {
  return (
    <div className={classes.root}>
      <Typography component='h1' variant='h4'>
        See your results below:
      </Typography>
      {results.map((result, i) =>
        <Result key={i} result={result} forWhich={i} classes={classes}/>
      )}
    </div>
  )
}

export default function Player () {
  const classes = useStyles();
  const { playerID } = useParams();
  const [question, setQuestion] = useState();
  const [timeRemain, setTimeRemain] = useState();
  const [selections, setSelections] = useState();
  const [answers, setAnswers] = useState();
  const [sessionEnded, setSessionEnded] = useState(false);
  const [results, setResults] = useState();
  const defaultMsg = { content: '', show: false, successful: false };
  const [msg, setMsg] = useState({ defaultMsg });
  const api = new API();

  // Reset clock on new question
  useEffect(() => {
    if (question) {
      setTimeRemain(question.time);
      setMsg(defaultMsg);
    }
  }, [question]);

  // Timer countdown
  useEffect(() => {
    let timer;
    if (timeRemain > 0) {
      timer = setInterval(() => {
        setTimeRemain(timeRemain - 1);
      }, 1000);
    } else if (timeRemain === 0) {
      handleTimeOut();
    }
    return () => clearInterval(timer);
  }, [timeRemain]);

  // Submit selections to server every time the user clicks a selection
  // Do not submit anything if user never made a selection,
  // i.e. selection is undefined
  useEffect(() => {
    if (selections) {
      api.makeRequest(`play/${playerID}/answer`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ answerIds: selections }),
      })
        .catch(err => console.error(err.message));
    }
  }, [selections])

  // Fetch current question the session is up to
  // Polling for next question until session end (400 error)
  useEffect(() => {
    const timer = !sessionEnded && setInterval(() => {
      api.makeRequest(`play/${playerID}/question`)
        .then(data => {
          setQuestion(prev => prev && prev.id === data.question.id ? prev : data.question);
        })
        .catch(err => { // session ended
          console.error(err.message);
          setSessionEnded(true);
        });
    }, 1000);

    // Display results on session ended
    if (sessionEnded) {
      handleEndOfSession();
    }

    return () => {
      clearInterval(timer);
    }
  }, [sessionEnded]);

  function displayAnswer (answerIds) {
    setAnswers(answerIds);
  }

  function handleTimeOut () {
    api.makeRequest(`play/${playerID}/answer`)
      .then(data => displayAnswer(data.answerIds))
      .catch(err => console.error(err.message));
  }

  function handleEndOfSession () {
    // get results
    api.makeRequest(`play/${playerID}/results`)
      .then(data => setResults(data))
      .catch(err => console.error(err.message));
  }

  return (
    <>
      {results
        ? <Results results={results} classes={classes}/>
        : <><Header title='Have fun playing'/>
          {!question
            ? <h1>Loading...</h1>
            : <div className={classes.root}>
                <Typography component='h1' variant='h3' align='center'>{question.content}</Typography>
                <MediaCard isEditing={false} classes={classes} question={question} />
                <Timer timeRemain={timeRemain} classes={classes}/>
                {msg.show &&
                  <Alert severity={msg.successful ? 'success' : 'error'}>
                    {msg.content}
                  </Alert>
                }
                <Options
                  question={question}
                  classes={classes}
                  answerIds={answers}
                  setMsg={setMsg}
                  setSelections={setSelections}
                  disabled={timeRemain === 0}
                />
              </div>}</>
      }
    </>
  )
}

Timer.propTypes = {
  timeRemain: PropTypes.number,
  classes: PropTypes.object,
}

Options.propTypes = {
  question: PropTypes.object,
  classes: PropTypes.object,
  answerIds: PropTypes.array,
  setMsg: PropTypes.func,
  setSelections: PropTypes.func,
  disabled: PropTypes.bool,
}

Results.propTypes = {
  results: PropTypes.array,
  classes: PropTypes.object,
}

Result.propTypes = {
  result: PropTypes.object,
  classes: PropTypes.object,
  forWhich: PropTypes.number,
}
