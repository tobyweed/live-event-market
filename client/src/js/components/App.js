import React, { Component } from 'react';
import '../../css/App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import LoginForm from './Auth/LoginForm';
import RegistrationForm from './Auth/RegistrationForm';
import Home from './Home/Home.js';
import Account from './Account/Account';
import SearchResults from './Search/SearchResults';
import Nav from './Nav/Nav';
import Footer from './Nav/Footer';

class App extends Component {
	render() {
		return (
			<Router>
				<div>
					<Nav />
					<Route exact path="/" component={Home} />
					<Route path="/login" component={LoginForm} />
					<Route path="/registration" component={RegistrationForm} />
					<Route path="/account" component={Account} />
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
