import React from 'react';
import ReactDOM from 'react-dom';

import '@fortawesome/fontawesome-free/css/all.min.css';
import './index.scss'; //Including bootstrap

import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();