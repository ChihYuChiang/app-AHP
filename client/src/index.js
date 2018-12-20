import React from 'react';
import ReactDOM from 'react-dom';

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'tippy.js/dist/tippy.css'
import 'tippy.js/dist/themes/light.css'
import './index.scss'; //Including bootstrap

import App from './App';
import unregister from './registerServiceWorker';


ReactDOM.render(<App />, document.getElementById('root'));
unregister();