import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.css';
import './index.css';

import App from './App';
import graph from './graph';


ReactDOM.render(<App />, document.getElementById('root'));
graph();