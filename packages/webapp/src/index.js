import React from 'react';
import ReactDOM from 'react-dom';

import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

// Load Global Styles
import './ui/styles/reset.css';
import './ui/styles/global.css';

import App from './App';
// import registerServiceWorker from './registerServiceWorker';

import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <LocaleProvider locale={enUS}>
      <App />
    </LocaleProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

// registerServiceWorker();
