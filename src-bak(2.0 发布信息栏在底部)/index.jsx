import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import AppState from './AppState';
import App from './App';

//window.appState = appState;
const appState = new AppState();
window.appState = appState;
render(
  <AppContainer>
    <App appState={appState}/>
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    render(
      <AppContainer>
        <NextApp appState={appState}/>
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
