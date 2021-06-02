import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/Header';
import {
  Paper,
  TextField,
  Grid,
  Typography,
  Button,
  Radio,
  Checkbox,
  Divider,
  InputBase,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Link as RouterLink, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import defaultImage from '../static/wallpaper_black_48dp.svg';
import API from '../utils/API';
import { userContext } from '../utils/userContext';
import MediaCard from '../components/MediaCard';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
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
    justifyContent: 'space-between',
    margin: theme.spacing(1),
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  fileInput: {
    display: 'none',
  },
  divider: {
    height: 28,
    margin: 4,
  },
  alert: {
    marginTop: theme.spacing(1),
  },
}));

// Dropdow selections: time, points and question type
function SelectionGroup ({ question, setQuestion }) {
  const classes = useStyles();

  function setOptions (e) {
    const len = parseInt(e.target.value);
    const numOptions = question.options.length;
    let newOptions = [];
    if (len < numOptions) {
      newOptions = question.options.slice(0, len);
    } else if (len > numOptions) {
      newOptions = [...question.options];
      for (let i = numOptions; i < len; i++) {
        newOptions.push({ content: '', isAnswer: false });
      }
    }
    setQuestion({ ...question, options: newOptions });
  }

  return (
    <div className={clsx(classes.horizontal, classes.vertical)}>
      <FormControl className={classes.formControl}>
        <InputLabel id="select-label-type">Choices</InputLabel>
        <Select
          labelId="select-label-type"
          id="select-type"
          value={question.type}
          onChange={(e) => { setQuestion({ ...question, type: e.target.value }) }}
        >
          <MenuItem value={'single'}>Single</MenuItem>
          <MenuItem value={'multiple'}>Multiple</MenuItem>
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel id="select-label-time">Time (s)</InputLabel>
        <Select
          labelId="select-label-time"
          id="select-time"
          value={question.time}
          onChange={(e) => { setQuestion({ ...question, time: e.target.value }) }}
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={30}>30</MenuItem>
          <MenuItem value={40}>40</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={60}>60</MenuItem>
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel id="select-label-points">Points</InputLabel>
        <Select
          labelId="select-label-points"
          id="select-points"
          value={question.points}
          onChange={(e) => { setQuestion({ ...question, points: e.target.value }) }}
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={30}>30</MenuItem>
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel id="select-label-options">Options</InputLabel>
        <Select
          labelId="select-label-options"
          id="select-options"
          value={question.options.length}
          onChange={(e) => setOptions(e) }
        >
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={6}>6</MenuItem>
        </Select>
      </FormControl>
    </div>
  )
}

// Submit, Reset and Cancel button
function ActionGroup ({ question, setQuestion, defaultValues, onSubmit, gameID }) {
  const classes = useStyles();
  const defaultMsg = { text: '', successful: false, show: false };
  const [msg, setMsg] = useState(defaultMsg);

  function isValid (question) {
    if (question.content === '') {
      return false;
    }
    if (question.options.some(e => e.content === '')) {
      return false;
    }
    if (question.options.every(e => !e.isAnswer)) {
      return false;
    }
    return true;
  }

  function handleSubmit (e) {
    e.preventDefault();
    if (!isValid(question)) {
      setMsg({
        text: 'Content, options and correct answer(s) cannot be empty!',
        successful: false,
        show: true,
      });
    } else {
      // setQuestion(question);
      setMsg({
        text: 'Done! Click cancel to go back to the game or keep editing current question',
        successful: true,
        show: true,
      });
      onSubmit();
    }
  }

  function closeMsg () {
    setMsg(defaultMsg);
  }

  function handleReset () {
    setQuestion(defaultValues);
    closeMsg();
  }

  return (
    <>
      <div className={classes.horizontal}>
        <Button
          variant="outlined"
          color="primary"
          onClick={(e) => handleSubmit(e)}>
          Submit
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleReset}>
          Reset
        </Button>
        <Button
          component={RouterLink}
          to={`/editgame/${gameID}`}
          variant="outlined"
          color="secondary">
          Cancel
        </Button>
      </div>
      {msg.show &&
        <Alert
          className={classes.alert}
          onClose={closeMsg}
          severity={msg.successful ? 'success' : 'error'}
        >
          {msg.text}
        </Alert>}
    </>
  )
}

// All options for the question
function OptionGroup ({ question, setQuestion }) {
  const classes = useStyles();
  const [selectedRadio, setSelectedRadio] = useState();
  const [checkedBox, setCheckedBox] = useState([]);
  useEffect(() => {
    setSelectedRadio();
    const defaultCheckedBox = Array(question.options.length).fill(false);
    setCheckedBox(defaultCheckedBox);
    if (question.type === 'single') {
      question.options.forEach((opt, i) => {
        if (opt.isAnswer) {
          setSelectedRadio(i);
        }
      })
    } else {
      const indices = [...defaultCheckedBox];
      question.options.forEach((opt, i) => {
        if (opt.isAnswer) {
          indices[i] = true;
        }
      });
      setCheckedBox(indices);
    }
  }, [question]);

  function handleSingleAnswer (index) {
    setSelectedRadio(index);
    setQuestion({
      ...question,
      options: question.options.map((o, i) =>
        i === index ? { ...o, isAnswer: true } : { ...o, isAnswer: false }
      ),
    })
  }

  function handleMultiAnswer (index) {
    setCheckedBox(checkedBox.map((checked, i) =>
      i === index ? !checked : checked
    ));
    setQuestion({
      ...question,
      options: question.options.map((o, i) =>
        i === index ? { ...o, isAnswer: !o.isAnswer } : o
      ),
    })
  }

  function handleOption (e, index) {
    const text = e.target.value.trim();
    if (text !== '') {
      setQuestion({
        ...question,
        options: question.options.map((o, i) =>
          i === index ? { ...o, content: text } : o
        ),
      });
    }
  }

  return <>
      <Typography component='h2' variant='subtitle2'>
        Select correct answer(s) by clicking the radio button below
      </Typography>
      {question.options.map((option, i) => (
        <Paper key={i} className={classes.option}>
          {question.type === 'single'
            ? <Radio
                value={i}
                checked={selectedRadio === i}
                onChange={() => handleSingleAnswer(i)}
                inputProps={{ 'aria-label': 'radio button' }}
              />
            : <Checkbox
                value={i}
                checked={option.isAnswer}
                onChange={() => handleMultiAnswer(i)}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            }
          <Divider className={classes.divider} orientation="vertical" />
          <InputBase
            className={classes.input}
            inputProps={{ 'aria-label': 'option for question' }}
            value={option.content}
            onChange={(e) => handleOption(e, i)}
            placeholder={`Type in option ${i + 1} here`}
          />
        </Paper>))
      }
    </>
}

export default function EditQuestion () {
  const classes = useStyles();
  const api = new API();
  const { token } = useContext(userContext);
  const { gameID, questionID } = useParams();
  const defaultValues = {
    id: questionID,
    content: '',
    mediaType: 'image',
    mediaSrc: `${String(defaultImage)}`,
    time: 20,
    type: 'single',
    points: 10,
    options: [{ content: '', isAnswer: false }, { content: '', isAnswer: false }],
  };
  const [question, setQuestion] = useState(defaultValues);
  const [isNewQuestion, setIsQuestion] = useState(true);

  // Questions fetched from server
  const [questions, setQuestions] = useState([]);
  const [metaData, setMetaData] = useState({});
  useEffect(() => {
    api.makeRequest(`admin/quiz/${gameID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(data => {
        setMetaData({ name: data.name, thumbnail: data.thumbnail });
        setQuestions(data.questions);
        data.questions.forEach(q => {
          if (q.id === questionID) {
            setQuestion(q);
            setIsQuestion(false);
          }
        });
      })
      .catch(err => console.error(err.message));
  }, []);

  // Submit updated questions list to server
  function submitQuestionsToServer () {
    const game = {
      ...metaData,
      thumbnail: metaData.thumbnail || question.mediaSrc,
      questions: isNewQuestion
        ? [...questions, question]
        : questions.map(q => q.id === questionID ? question : q),
    }
    api.makeRequest(`admin/quiz/${gameID}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(game),
    });
  }

  return (
    <>
      <Header title='Edit question'/>
      <Grid container justify='center' className={classes.root}>
        <Grid item sm={8} xs={10} component={Paper}
          className={classes.paper}
          elevation={3}
        >
          <Typography component="h1" variant="h5">Edit Question</Typography>
          <Typography component="h2" variant="subtitle1" color='textSecondary'>Confirm or cancel editing to go back to the game</Typography>
            <form noValidate autoComplete="off">
              <TextField
                id="outlined-basic"
                label="Content"
                placeholder="Type your question here"
                margin='normal'
                value={question.content}
                onChange={(e) => setQuestion({ ...question, content: e.target.value }) }
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                fullWidth
              />
              <div className={classes.horizontal}>
                <MediaCard question={question} setQuestion={setQuestion} classes={classes}/>
                <SelectionGroup question={question} setQuestion={setQuestion}/>
              </div>
              <OptionGroup question={question} setQuestion={setQuestion} />
              <ActionGroup
                className={classes.horizontal}
                question={question}
                setQuestion={setQuestion}
                defaultValues={defaultValues}
                gameID={gameID}
                questionID={questionID}
                onSubmit={submitQuestionsToServer}
              />
            </form>
        </Grid>
      </Grid>
    </>
  );
}

SelectionGroup.propTypes = {
  question: PropTypes.object,
  setQuestion: PropTypes.func,
}

ActionGroup.propTypes = {
  question: PropTypes.object,
  setQuestion: PropTypes.func,
  defaultValues: PropTypes.object,
  questions: PropTypes.array,
  setQuestions: PropTypes.func,
  gameID: PropTypes.string,
  questionID: PropTypes.string,
  onSubmit: PropTypes.func,
}

OptionGroup.propTypes = {
  question: PropTypes.object,
  setQuestion: PropTypes.func,
}
