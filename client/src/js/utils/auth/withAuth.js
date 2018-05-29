import React, { Component } from 'react';
import AuthService from './AuthService';

/*
* This class is a Higher Order Component which is applied
* to other components if you want them to be hidden to
* users who are not logged in.
*
* TLDR use this if you want to make a view permissioned
*/

export default function withAuth(AuthComponent) {
	return class AuthWrapped extends Component {
		constructor() {
			super();
			this.state = {
				user: null
			};
			this.Auth = new AuthService();
		}

		componentWillMount() {
			this.Auth.tryAccess(); //set the access headers
			if (!this.Auth.loggedIn()) { //If we are not logged in, redirect us to loginset the access headers
				this.props.history.replace('/login');
			} else {
				//Otherwise, set the user in props
				try {
					const profile = this.Auth.getProfile();
					this.setState({
						user: profile
					});
				} catch (err) {
					this.Auth.logout();
					this.props.history.replace('/login');
				}
			}
		}

		render() {
			if (this.state.user) {
				//Only render our page if there is a user
				return (
					<AuthComponent history={this.props.history} user={this.state.user} />
				);
			} else {
				return null;
			}
		}
	};
}
