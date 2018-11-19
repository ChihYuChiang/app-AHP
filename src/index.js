import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.css';
import './index.scss';

import App from './App';
import showSliderValue from './js/showSliderValue';

ReactDOM.render(<App />, document.getElementById('root'));

showSliderValue();