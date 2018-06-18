import React, { Component } from 'react';
import '../../css/App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { refreshData } from '../actions.js';

import AuthService from '../utils/auth/AuthService';
import withAuth from '../utils/auth/withAuth';

import LoginForm from './ChildComponents/LoginForm';
import RegistrationForm from './ChildComponents/RegistrationForm';
import Home from './MasterComponents/Home.js';
import Account from './MasterComponents/Account';
import Nav from './ChildComponents/Nav';
import Footer from './ChildComponents/Footer';

class App extends Component {
	// constructor(props) {
	// 	super(props);
	// 	this.Auth = new AuthService();
	// }

	componentWillMount() {
		// // get user and promoter data in an object from Auth
		// this.Auth.getData().then(res => {
		// 	this.props.dispatch(refreshData(res)); //add that to redux state
		// });
	}

	render() {
		// return this.props.userData ? (
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
		// ) : (
		// 	<p>The page is loading</p>
		// );
	}
}

function mapStateToProps(state) {
	return {
		userData: state.userData,
		promoterData: state.promoterData
	};
}

export default connect(mapStateToProps)(App);
