import React, { Component } from 'react';
import axios from 'axios';
import '../../css/App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import AuthService from '../utils/auth/AuthService';
import withAuth from '../utils/auth/withAuth';

import LoginForm from './ChildComponents/LoginForm';
import RegistrationForm from './ChildComponents/RegistrationForm';
import Home from './MasterComponents/Home.js';
import Account from './MasterComponents/Account';
import Nav from './ChildComponents/Nav';
import Footer from './ChildComponents/Footer';

class App extends Component {
	constructor() {
		super();
		this.Auth = new AuthService();
	}

	state = {
		yo: 'hi'
	};

	render() {
		return (
			<Router>
				<div>
					<Nav />
					<Route exact path="/" component={Home} />
					<Route path="/login" component={LoginForm} />
					<Route path="/registration" component={RegistrationForm} />
					<Route path="/account" component={Account} />
					<Footer />
				</div>
			</Router>
		);
	}
}

//<Route path="/Search" component={_search} />
//<Route path="/Event" component={_event} />
//<Route path="/User" component={_user} />
//<Route path="/Pomoter" component={_promoter} />

export default withAuth(App);
