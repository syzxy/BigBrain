import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  table: {
    minWidth: 400,
  },
  barChart: {
    minWidth: 400,
    marginTop: 10,
    padding: '10px 20px 0',
    borderBottom: '2px solid rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  barContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    margin: '0 4px',
  },
  bar: {
    background: 'rgba(0,200,0,0.3)',
    border: '1px solid rgba(0,0,0,0.1)',
    width: 20,
  },
  redBar: {
    background: 'rgba(200,0,0,0.3)',
  },
});

const getPlayerScore = (playerAnswers, integrated = false) => {
  return playerAnswers.reduce((a, c) => c.correct ? a + c.points : a, 0);
}

function getTopFive (data) {
  const compare = (p1, p2) => {
    return getPlayerScore(p2.answers) - getPlayerScore(p1.answers);
  }
  return data.sort(compare).slice(0, Math.min(data.length, 5));
}

export function ResultTable ({ data }) {
  const classes = useStyles();
  const topFiveResults = getTopFive(data);

  return (
    <TableContainer component={Paper}>
      <Typography component='div' variant='subtitle1' align='center'>Top five scoring players</Typography>
      <Table className={classes.table} size='small' aria-label="dense table">
        <TableHead>
          <TableRow>
            <TableCell>Rank</TableCell>
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {topFiveResults.map((r, i) => (
            <TableRow key={i}>
              <TableCell component="th" scope="row">
                {i + 1}
              </TableCell>
              <TableCell align="center">{r.name}</TableCell>
              <TableCell align="center">{getPlayerScore(r.answers)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ResultBarChart ({ data }) {
  const classes = useStyles();
  const playerAnswers = data.map(d => d.answers);
  const numQuestions = playerAnswers[0].length;
  const numPlayers = playerAnswers.length;
  const countCorrectPerQuestion = Array(numQuestions).fill(0);
  const responseTimePerQuestion = Array(numQuestions).fill(0);
  playerAnswers.forEach(p => {
    p.forEach((a, i) => {
      if (a.correct) {
        countCorrectPerQuestion[i]++;
      }
      if (a.answeredAt && a.questionStartedAt) {
        responseTimePerQuestion[i] += (new Date(a.answeredAt) - new Date(a.questionStartedAt)) / 1e3;
      } else {
        responseTimePerQuestion[i] += a.timeLimit;
      }
    });
  });
  const avgResponseTimePerQuestion = responseTimePerQuestion.map(t =>
    Math.round(t / numPlayers * 10) / 10
  );
  const maxNumCorrect = Math.max(...countCorrectPerQuestion);
  const minNumCorrect = Math.min(...countCorrectPerQuestion);
  const maxAvgResponseTime = Math.max(...avgResponseTimePerQuestion);
  const minAvgResponseTime = Math.min(...avgResponseTimePerQuestion);

  return (
    <>
      <div className={classes.barChart}>
        {countCorrectPerQuestion.map((c, i) => (
          <div key={i} className={classes.barContainer}>
            <Typography variant="caption">{c}</Typography>
            <span
              className={classes.bar}
              style={
                { height: `${(c - minNumCorrect) / maxNumCorrect * 100 + 20}px` }
              }>
             </span>
            <Typography variant="caption">Q {i + 1}</Typography>
          </div>
        ))}
      </div>
      <Typography variant='caption'>Number of correct answers per question</Typography>
      <div className={classes.barChart}>
        {avgResponseTimePerQuestion.map((t, i) => (
          <div key={i} className={classes.barContainer}>
            <Typography variant="caption">{t}s</Typography>
            <span
              className={`${classes.bar} ${classes.redBar}`}
              style={
                { height: `${(t - minAvgResponseTime) / maxAvgResponseTime * 150 + 20}px` }
              }>
            </span>
            <Typography variant="caption">Q {i + 1}</Typography>
          </div>
        ))}
      </div>
      <Typography variant='caption'>Average response time per question</Typography>
    </>
  )
}

ResultTable.propTypes = {
  data: PropTypes.array,
}

ResultBarChart.propTypes = {
  data: PropTypes.array,
}
