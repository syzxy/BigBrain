import React, { useEffect, useState, useContext } from 'react';
import { userContext } from '../utils/userContext';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import PropTypes from 'prop-types';
import API from '../utils/API';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import { ResultTable, ResultBarChart } from '../components/ResultCharts';

// import ReactECharts from 'echarts-for-react';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    maxWidth: '600px',
    margin: '20px auto',
  },
}));

export default function SessionResult () {
  const classes = useStyles();
  const api = new API();
  const { token } = useContext(userContext);
  const [sessionResult, setSessionResult] = useState();
  const [fullResult, setFullResult] = useState();
  const [questions, setQuestions] = useState();
  const { gameID, sessionID } = useParams();
  const getSessionResult = () => {
    api.makeRequest(`admin/session/${sessionID}/results`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(data => {
      setSessionResult(data.results)
    });
  }
  const getQuestions = () => {
    api.makeRequest(`admin/quiz/${gameID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(data => setQuestions(data.questions))
      .catch(err => console.warn(err));
  }

  // Fetch the result and all questions of a session
  useEffect(() => {
    getSessionResult(sessionID);
    getQuestions(gameID);
  }, [])

  // Integrate sessionResult with question scores
  useEffect(() => {
    if (sessionResult && questions) {
      const results = [];
      sessionResult.forEach((r) => {
        const answers = r.answers.map((a, i) =>
          ({ ...a, points: questions[i].points, timeLimit: questions[i].time })
        );
        results.push({ ...r, answers: answers });
      });
      setFullResult(results);
    }
  }, [sessionResult, questions])

  return (
    <>
      <Header title='Game Result(host)'/>
      <div className={classes.root}>
        {fullResult === undefined
          ? <h1>Loading...</h1>
          : !fullResult.length
              ? <h1>Nobody participated in this session</h1>
              : <><ResultTable data={fullResult} />
                <ResultBarChart data={fullResult} /></>
        }
        <Button
          component={Link}
          to='/'
          variant="contained"
          color="primary"
          size="large"
          className={classes.button}
          startIcon={<HomeIcon />}
        >
          Go back to homepage
        </Button>
      </div>
    </>
  )
}

SessionResult.propTypes = {
  token: PropTypes.string,
  sessionID: PropTypes.string,
}
