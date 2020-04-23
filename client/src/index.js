import 'react-app-polyfill/ie9'; // For IE 9-11 support
import 'react-app-polyfill/stable';
// import 'react-app-polyfill/ie11'; // For IE 11 support
import './polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom'
import { checkLoggedIn } from "./stores/actions/authActions";
import configureStore from "./stores/index";

import { PersistGate } from 'redux-persist/integration/react'

const renderApp = preloadedState => {
  const { persistor, store } = configureStore(preloadedState);
  window.state = store.getState();

  ReactDOM.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>,
    document.getElementById("root")
  );
};

(async () => renderApp(await checkLoggedIn()))();
serviceWorker.unregister();
