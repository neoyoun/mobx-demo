import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import AppState from './AppState';
import App from './App';

//window.appState = appState;
const appState = new AppState();
render(
  <AppContainer>
    <App store={appState}/>
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  window.appState = appState;
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    render(
      <AppContainer>
        <NextApp store={appState}/>
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
