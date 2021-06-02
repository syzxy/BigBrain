import React, { useState, useMemo } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from 'react-router-dom';
import './App.css';
import { userContext } from './utils/userContext';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Lobby from './pages/Lobby';
import Join from './pages/Join';
import EditGame from './pages/EditGame';
import EditQuestion from './pages/EditQuestion';
import SessionResult from './pages/SessionResult';
import PlayGame from './pages/PlayGame';

export default function App () {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const updateUserSession = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  }

  const userSession = useMemo(() => ({ token, updateUserSession }), [token]);

  return (
    <Router>
      <userContext.Provider value={userSession}>
        <div>
          <Switch>
            <Route path='/login'>
              { token ? <Redirect to='/' /> : <Login /> }
            </Route>
            <Route path='/signup'>
              { token ? <Redirect to='/' /> : <Signup /> }
            </Route>
            <Route exact path='/'>
              { token ? <Home token={token}/> : <Redirect to='/login' /> }
            </Route>
            <Route path='/join/:gameID'>
              <Join/>
            </Route>
            <Route path='/join'>
              <Join/>
            </Route>
            <Route path='/editgame/:gameID'>
              { token ? <EditGame token={token}/> : <Redirect to='/login' /> }
            </Route>
            <Route path='/editquestion/:gameID/:questionID'>
              { token ? <EditQuestion/> : <Redirect to='/login' /> }
            </Route>
            <Route path='/lobby/:playerID'>
              <Lobby />
            </Route>
            <Route path='/play/:playerID'>
              <PlayGame />
            </Route>
            <Route path='/results/:gameID/:sessionID'>
              { token ? <SessionResult /> : <Redirect to='/login' /> }
            </Route>
          </Switch>
        </div>
      </userContext.Provider>
      <div>
        <Footer/>
      </div>
    </Router>
  );
}
