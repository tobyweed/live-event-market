import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './css/index.css';
import App from './js/components/App';
import LoginForm from './js/components/Auth/LoginForm';
import Nav from './js/components/Nav/Nav';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
	<Router>
		<div>
			<Nav />
			<Route exact path="/" component={App} />
			<Route exact path="/login" component={LoginForm} />
		</div>
	</Router>,

	document.getElementById('root')
);
registerServiceWorker();
