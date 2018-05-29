import React, { Component } from 'react';
import AuthService from './AuthService';

/*
* This class is a Higher Order Component which is applied
* to other components if you want them to be hidden if you're not logged in.
*
* Note that you should usually export this wrapping withAuth like:
* "hidden(withAuth(component))" instead of the other way around
*
* TLDR use this if you want to make a view permissioned
*/

export default function hidden(AuthComponent) {
	return class AuthWrapped extends Component {
		constructor() {
			super();
			this.Auth = new AuthService();
		}

		componentWillMount() {
			if (!this.Auth.loggedIn()) {
				//If we are not logged in, redirect us to login
				this.props.history.replace('/login');
			}
		}

		render() {
			return <AuthComponent history={this.props.history} />;
		}
	};
}
