import React, { Component } from 'react';
import '../../css/App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import AuthService from '../utils/auth/AuthService';

import LoginForm from './Auth/LoginForm';
import RegistrationForm from './Auth/RegistrationForm';
import Home from './Home/Home.js';
import Account from './Account/Account';
import SearchResults from './Search/SearchResults';
import Nav from './Nav/Nav';
import Footer from './Nav/Footer';

class App extends Component {
	constructor() {
		super();
		this.Auth = new AuthService();
	}

	render() {
		let loggedIn = this.Auth.loggedIn();
		return (
			<Router>
				<div>
					<Nav />
					<Route exact path="/" component={Home} />
					<Route
						path="/login"
						render={() => (loggedIn ? <Redirect to="/" /> : <LoginForm />)}
					/>
					<Route
						path="/registration"
						render={() =>
							loggedIn ? <Redirect to="/" /> : <RegistrationForm />
						}
					/>
					<Route
						path="/account"
						render={() => (!loggedIn ? <Redirect to="/login" /> : <Account />)}
					/>
					<Route path="/search-results" component={SearchResults} />
					<Footer />
				</div>
			</Router>
		);
	}
}

function mapStateToProps(state) {
	return {
		userData: state.idData.userData,
		promoterData: state.idData.promoterData
	};
}

export default connect(mapStateToProps)(App);
