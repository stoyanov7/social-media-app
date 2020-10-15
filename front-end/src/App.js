import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import './App.css';
import themeFile from './utils/theme';

import { Provider } from 'react-redux';
import store from './redux/store';

import Navbar from './components/Navbar';
import AuthRoute from './components/AuthRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

const theme = createMuiTheme(themeFile);
const token = localStorage.FBIdToken;
let authenticated;

if (token) {
  const decodedToken = jwtDecode(token);

  if (decodedToken.exp * 1000 < Date.now()) {
    window.location.href = '/login';
    authenticated = false;
  } else {
    authenticated = true;
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
                  authenticated={authenticated} 
                />
                <AuthRoute 
                  exact 
                  path='/signup' 
                  component={Signup}
                  authenticated={authenticated}
                />
              </Switch>
            </div>
        </Router>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;