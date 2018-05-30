import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './css/index.css';
import registerServiceWorker from './registerServiceWorker';

import App from './js/components/App';
import LoginForm from './js/components/ChildComponents/LoginForm';
import RegistrationForm from './js/components/ChildComponents/RegistrationForm';
import Home from './js/components/MasterComponents/Home.js';
import Account from './js/components/MasterComponents/Account';
import Nav from './js/components/ChildComponents/Nav';
import Footer from './js/components/ChildComponents/Footer';

//import master components
//import _search from './components/masterComponents/search';
//import _event from './components/masterComponents/event';
//import _user from './components/masterComponents/user';
//import _promoter from './components/masterComponents/promoter';

ReactDOM.render(
	<Router>
		<div>
			<Nav />
			<Route exact path="/" component={Home} />
			<Route path="/app" component={App} />
			<Route path="/login" component={LoginForm} />
			<Route path="/registration" component={RegistrationForm} />
			<Route path="/account" component={Account} />
			<Footer />
		</div>
	</Router>,

	document.getElementById('root')
);
registerServiceWorker();

//<Route path="/Search" component={_search} />
//<Route path="/Event" component={_event} />
//<Route path="/User" component={_user} />
//<Route path="/Pomoter" component={_promoter} />
