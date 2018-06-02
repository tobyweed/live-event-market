import React, { Component } from 'react';
import axios from 'axios';
import AuthService from './AuthService';

/*
* This class is a Higher Order Component which is applied
* to other components if you want them to have auth capabilities
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
			const refresh = this.Auth.getRefresh();
			if (this.Auth.loggedIn()) {
				this.setPrivileges();
			} else if (!!refresh && !this.Auth.isTokenExpired(refresh)) {
				axios.defaults.headers.common['Authorization'] = `Bearer ${refresh}`; //set the header to be the refresh token
				axios.post('/token/refresh').then(res => {
					//refresh access token
					this.Auth.setAccess(res.data.access_token);
					this.Auth.setRefresh(res.data.refresh_token);

					this.setPrivileges();
				});
			} else {
				this.Auth.logout();
				this.props.history.replace('/login');
				console.log('Something went wrong');
			}
		}

		setPrivileges() {
			this.Auth.setHeader();
			const profile = this.Auth.getProfile();
			this.setState({
				user: profile
			});
		}

		render() {
			const user = this.state.user;
			return (
				<div>
					{user && (
						<AuthComponent
							history={this.props.history}
							user={this.state.user}
						/>
					)}
				</div>
			);
		}
	};
}
