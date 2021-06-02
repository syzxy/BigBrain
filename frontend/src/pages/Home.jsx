import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import JoinGameButton from '../components/JoinGameButton';
import AddGameButton from '../components/AddGameButton';
import GameCard from '../components/GameCard';
import NewGameForm from '../components/NewGameForm';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import API from '../utils/API';

export default function Home ({ token }) {
  const [games, setGames] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState({ content: '', show: false });
  const api = new API();
  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      margin: 5,
      padding: 5,
    },
    container: {
      width: '90%',
      margin: '0 auto',
      justifyContent: 'center',
      '& > *': {
        margin: theme.spacing(1),
      }
    },
  }));
  const classes = useStyles();

  // Fetch all games created by current user from server
  const fetchGameList = token => {
    api.makeRequest('admin/quiz', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
    }).then(data => {
      setGames(data.quizzes);
    });
  }

  // Update list on load and when token changes
  useEffect(() => {
    fetchGameList(token);
  }, [token]);

  // Upload questions to server, non-empty question list only when loading from a json
  function upLoadQuestions (game, gameID) {
    api.makeRequest(`admin/quiz/${gameID}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(game),
    });
  }

  // Create a new game
  const createNewGame = game => {
    api.makeRequest('admin/quiz/new', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        name: `${game.name.charAt(0).toUpperCase() + game.name.slice(1)}`,
      })
    })
      .then((data) => upLoadQuestions(game, data.quizId))
      .then(() => setMsg({
        content: 'Done, close form or continue adding',
        show: true,
        success: true,
      }))
      .then(() => fetchGameList(token))
      .catch(err => {
        if (err === '400') setMsg({ content: 'Invalid title', show: true });
        else if (err === '404') {
          setMsg({
            content: 'Invalid token, check your login state',
            show: true,
            success: false,
          });
        }
      });
  }

  // Delete a game
  const deleteGame = id => {
    api.makeRequest(`admin/quiz/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      setGames(games.filter(game => game.id !== id))
    });
  }

  // Next question
  return (
    <>
      <Header />
      <div className={classes.root}>
        {showForm &&
          <NewGameForm
            setShowForm={setShowForm}
            msg={msg}
            setMsg={setMsg}
            onSubmit={createNewGame}
          />}
        <Grid container className={classes.container}>
          <Grid item sm={5} xs={10}>
            <Link to={'/join'} target = '_blank'>
              <JoinGameButton/>
            </Link>
          </Grid>
          <Grid item sm={5} xs={10}>
            <AddGameButton
            onClick={() => setShowForm(true)}/>
          </Grid>
        </Grid>
        <Grid container justify='center'>
          <Grid container style={{ width: '90%', maxWidth: '1200px' }} spacing={3}>
            {games.map((game, i) => (
              <Grid item key={game.id} md={4} sm={6} xs={12}>
                <GameCard
                  position={i}
                  id={game.id}
                  name={game.name}
                  thumbnail={game.thumbnail}
                  onDelete={deleteGame}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </div>
    </>
  );
}

Home.propTypes = {
  token: PropTypes.string,
}
