import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Typography } from '@material-ui/core';
import { AddQuestionButton } from '../components/AddQuestionButton';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import API from '../utils/API';
import PropTypes from 'prop-types';
import QuestionCard from '../components/QuestionCard';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '80%',
    maxWidth: '1200px',
    margin: '0 auto',
    '& > *': {
      maxWidth: '600px',
      margin: '8px auto',
    }
  },
  text: {
    marginTop: theme.spacing(2),
  },
  caption: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& > svg': {
      margin: '2px',
      color: theme.palette.text.secondary,
    }
  }
}));

export default function EditGame ({ token }) {
  const { gameID } = useParams();
  const classes = useStyles();

  // All questions under this game
  const [questions, setQuestions] = useState([]);
  const [didDelete, setDidDelete] = useState(false);
  const [metaData, setMetaData] = useState({});
  const api = new API();
  useEffect(() => {
    api.makeRequest(`admin/quiz/${gameID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(data => {
        setMetaData({ name: data.name, thumbnail: data.thumbnail });
        setQuestions(data.questions);
      })
      .catch(err => console.error(err.message));
  }, []);

  function deleteQuestion (questionID) {
    setDidDelete(true);
    setQuestions(questions.filter(q => q.id !== questionID));
  }

  // Commit deletion, only if any, to server
  useEffect(() => { didDelete && commitDeletion() }, [didDelete]);
  function commitDeletion () {
    setDidDelete(false);
    const game = {
      ...metaData,
      questions,
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
      <Header title={`Editing game: ${metaData.name}`}/>
      <div className={classes.root}>
        <Typography className={classes.text} component='h1' variant='h5' align='center'>
          { !questions.length
            ? 'No question '
            : questions.length === 1
              ? '1 question '
              : `${questions.length} questions `}
          under {metaData.name}<br/>
        </Typography>
        <Typography className={classes.caption} component='h2' variant='subtitle1' align='center'>
          you can add<AddIcon/>, edit<EditIcon/> or delete<DeleteIcon/> games.
        </Typography>
        <AddQuestionButton gameID={gameID} />
      {questions.map((q, i) =>
        <QuestionCard key={q.id} onDelete={deleteQuestion} question={q} gameID={gameID} displayID={i + 1}/>
      )}
      </div>
    </>
  );
}

EditGame.propTypes = {
  token: PropTypes.string,
}
