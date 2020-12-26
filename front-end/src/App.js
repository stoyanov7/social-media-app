import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import './App.css';
import themeFile from './utils/theme';

import { Provider } from 'react-redux';
import store from './redux/store';
import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userAction';

import Navbar from './components/layout/Navbar';
import AuthRoute from './components/AuthRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

const theme = createMuiTheme(themeFile);
const token = localStorage.FBIdToken;

if (token) {
  const decodedToken = jwtDecode(token);

  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser())
    window.location.href = '/login';
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
}

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>        
        <Router>
          <Navbar />
            <div className="container">
              <Switch>
                <Route exact path='/' component={Home} />
                <AuthRoute 
                  exact 
                  path='/login' 
                  component={Login}
                />
                <AuthRoute 
                  exact 
                  path='/signup' 
                  component={Signup}
                />
              </Switch>
            </div>
        </Router>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;