import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import {appState,data} from './AppState';
import App from './App';

//const appState = new AppState();
window.appState = appState;
window.data = data;
render(
  <AppContainer>
    <App appState={appState} data={data}/>
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;

    render(
      <AppContainer>
        <NextApp appState={appState} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
