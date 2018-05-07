import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import { Title, List } from './components/App';

ReactDOM.render(
  <Router>
    <div>
    <Router exact path='/' component={Title} />
    <Router path='/list' component={List} />
    </div>
  </Router>,
  document.getElementById('content')
);
