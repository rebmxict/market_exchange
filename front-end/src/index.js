import React from 'react';
import ReactDOM from 'react-dom';
import './css/bootstrap.min.css';
import './index.css';
import LandPage from './components/landpage/LandPage';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(<BrowserRouter><LandPage /></BrowserRouter>, document.getElementById('root'));
registerServiceWorker();